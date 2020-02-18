package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"strconv"
)

// Namespaces constants
const (
	documentIndex = "Document"
)

// Numerical constants
const (
	documentKeyFieldsNumber      = 1
	DocumentBasicArgumentsNumber = 3
)

// Document type constants (from 0 to 3)
const (
	docTypeUnknown = iota
	docTypeImage
	docTypeAudio
	docTypeVideo
	docTypePdf
)

var documentTypeLegal = map[int][]int{
	docTypeUnknown: {},
	docTypeImage:   {},
	docTypeAudio:   {},
	docTypeVideo:   {},
	docTypePdf:     {},
}

type Document struct {
	Key   DocumentKey   `json:"key"`
	Value DocumentValue `json:"value"`
}

type DocumentKey struct {
	DocumentID string `json:"documentID"`
}

type DocumentValue struct {
	DocumentHash        string `json:"documentHash"`
	DocumentType        int    `json:"documentType"`
	DocumentDescription string `json:"documentDescription"`
	Timestamp           int64  `json:"timestamp"`
	Updated             int64  `json:"updated"`
}

func CreateDocument() LedgerData {
	return new(Document)
}

func (data *Document) FillFromArguments(stub shim.ChaincodeStubInterface, args []string) error {
	if len(args) < DocumentBasicArgumentsNumber+documentKeyFieldsNumber {
		return errors.New(fmt.Sprintf("arguments array must contain at least %d items", DocumentBasicArgumentsNumber+documentKeyFieldsNumber))
	}

	if err := data.FillFromCompositeKeyParts(args[:documentKeyFieldsNumber]); err != nil {
		return err
	}

	docType, err := strconv.Atoi(args[1])
	if err != nil {
		return errors.New(fmt.Sprintf("document Type is invalid: %s (must be int)", args[1]))
	}

	if !Contains(documentTypeLegal, docType) {
		return errors.New(fmt.Sprintf("document Type is invalid: %d (must be from 0 to 4)", docType))
	}

	data.Value.DocumentType = docType
	data.Value.DocumentDescription = args[2]
	data.Value.DocumentHash = args[3]
	return nil
}

func (data *Document) FillFromCompositeKeyParts(compositeKeyParts []string) error {
	if len(compositeKeyParts) < documentKeyFieldsNumber {
		return errors.New(fmt.Sprintf("composite key parts array must contain at least %d items", documentKeyFieldsNumber))
	}

	data.Key.DocumentID = compositeKeyParts[0]

	return nil
}

func (data *Document) FillFromLedgerValue(ledgerBytes []byte) error {
	if err := json.Unmarshal(ledgerBytes, &data.Value); err != nil {
		return err
	} else {
		return nil
	}
}

func (data *Document) ToCompositeKey(stub shim.ChaincodeStubInterface) (string, error) {
	compositeKeyParts := []string{
		data.Key.DocumentID,
	}

	return stub.CreateCompositeKey(documentIndex, compositeKeyParts)
}

func (data *Document) ToLedgerValue() ([]byte, error) {
	return json.Marshal(data.Value)
}

func (data *Document) ExistsIn(stub shim.ChaincodeStubInterface, collection string) bool {
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
