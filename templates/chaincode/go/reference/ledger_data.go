package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var ledgerDataLogger = shim.NewLogger("LedgerData")

type LedgerData interface {
	FillFromArguments(stub shim.ChaincodeStubInterface, args []string) error

	FillFromCompositeKeyParts(compositeKeyParts []string) error

	FillFromLedgerValue(ledgerValue []byte) error

	ToCompositeKey(stub shim.ChaincodeStubInterface) (string, error)

	ToLedgerValue() ([]byte, error)
}

func Contains(m map[int][]int, key int) bool {
	_, ok := m[key]
	if !ok {
		return false
	}

	return true
}

func CheckStateValidity(statesAutomaton map[int][]int, oldState, newState int) bool {
	possibleStates, ok := statesAutomaton[oldState]
	if ok {
		for _, state := range possibleStates {
			if state == newState {
				return true
			}
		}
	}

	return false
}

func ExistsIn(stub shim.ChaincodeStubInterface, data LedgerData, collection string) bool {
	compositeKey, err := data.ToCompositeKey(stub)
	if err != nil {
		return false
	}

	if collection != "" {
		logger.Debug("GetPrivateData")
		if data, err := stub.GetPrivateData(collection, compositeKey); err != nil || data == nil {
			return false
		}
	} else {
		logger.Debug("GetState")
		if data, err := stub.GetState(compositeKey); err != nil || data == nil {
			return false
		}
	}

	return true
}

func LoadFrom(stub shim.ChaincodeStubInterface, data LedgerData, collection string) error {
	var bytes []byte
	compositeKey, err := data.ToCompositeKey(stub)
	if err != nil {
		return err
	}

	if collection != "" {
		logger.Debug("GetPrivateData")
		bytes, err = stub.GetPrivateData(collection, compositeKey)
	} else {
		logger.Debug("GetState")
		bytes, err = stub.GetState(compositeKey)
	}

	if err != nil {
		return err
	}

	return data.FillFromLedgerValue(bytes)
}

func UpdateOrInsertIn(stub shim.ChaincodeStubInterface, data LedgerData, collection string) error {
	compositeKey, err := data.ToCompositeKey(stub)
	if err != nil {
		return err
	}

	value, err := data.ToLedgerValue()
	if err != nil {
		return err
	}

	if collection != "" {
		logger.Debug("PutPrivateData")

		if err = stub.PutPrivateData(collection, compositeKey, value); err != nil {
			return err
		}
	} else {
		logger.Debug("PutState")
		if err = stub.PutState(compositeKey, value); err != nil {
			return err
		}
	}

	return nil
}

type FactoryMethod func() LedgerData

type FilterFunction func(data LedgerData) bool

func EmptyFilter(data LedgerData) bool {
	return true
}

func Query(stub shim.ChaincodeStubInterface, index string, partialKey []string,
	createEntry FactoryMethod, filterEntry FilterFunction, collections []string) ([]byte, error) {

	ledgerDataLogger.Info(fmt.Sprintf("Query(%s) is running", index))
	ledgerDataLogger.Debug("Query " + index)

	entries := []LedgerData{}
	if len(collections) != 0 && collections[0] != "" {
		for _, collection := range collections {
			it, err := stub.GetPrivateDataByPartialCompositeKey(collection, index, partialKey)
			if err != nil {
				message := fmt.Sprintf("unable to get state by partial composite key %s: %s", index, err.Error())
				ledgerDataLogger.Error(message)
				return nil, errors.New(message)
			}

			iteratorEntries, err := queryImpl(it, createEntry, stub, filterEntry)
			if err != nil {
				ledgerDataLogger.Error(err.Error())
				return nil, err
			}

			entries = append(entries, iteratorEntries...)

			it.Close()
		}
	} else {
		it, err := stub.GetStateByPartialCompositeKey(index, partialKey)
		if err != nil {
			message := fmt.Sprintf("unable to get state by partial composite key %s: %s", index, err.Error())
			ledgerDataLogger.Error(message)
			return nil, errors.New(message)
		}
		defer it.Close()

		entries, err = queryImpl(it, createEntry, stub, filterEntry)
		if err != nil {
			ledgerDataLogger.Error(err.Error())
			return nil, err
		}
	}

	result, err := json.Marshal(entries)
	if err != nil {
		return nil, err
	}
	ledgerDataLogger.Debug("Result: " + string(result))

	ledgerDataLogger.Info(fmt.Sprintf("Query(%s) exited without errors", index))
	ledgerDataLogger.Debug("Success: Query " + index)
	return result, nil
}

func queryImpl(it shim.StateQueryIteratorInterface, createEntry FactoryMethod, stub shim.ChaincodeStubInterface,
	filterEntry FilterFunction) ([]LedgerData, error) {

	entries := []LedgerData{}

	for it.HasNext() {
		response, err := it.Next()
		if err != nil {
			message := fmt.Sprintf("unable to get an element next to a query iterator: %s", err.Error())
			return nil, errors.New(message)
		}

		ledgerDataLogger.Debug(fmt.Sprintf("Response: {%s, %s}", response.Key, string(response.Value)))

		entry := createEntry()

		if err := entry.FillFromLedgerValue(response.Value); err != nil {
			message := fmt.Sprintf("cannot fill entry value from response value: %s", err.Error())
			return nil, errors.New(message)
		}

		_, compositeKeyParts, err := stub.SplitCompositeKey(response.Key)
		if err != nil {
			message := fmt.Sprintf("cannot split response key into composite key parts slice: %s", err.Error())
			return nil, errors.New(message)
		}

		if err := entry.FillFromCompositeKeyParts(compositeKeyParts); err != nil {
			message := fmt.Sprintf("cannot fill entry key from composite key parts: %s", err.Error())
			return nil, errors.New(message)
		}

		if bytes, err := json.Marshal(entry); err == nil {
			ledgerDataLogger.Debug("Entry: " + string(bytes))
		}

		if filterEntry(entry) {
			entries = append(entries, entry)
		}
	}

	return entries, nil
}
