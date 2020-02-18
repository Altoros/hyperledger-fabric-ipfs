package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"fmt"
	"encoding/json"
	pb "github.com/hyperledger/fabric/protos/peer"
	"time"
)

type Method struct {
}

func createDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//  0	    		1		 2            3
	// "DocumentID"  "Type"	"Description"  "HashDoc"
	logger.Info("##### IPFS createDocument is running. #####")
	logger.Debug("IPFS.createDocument")

	document := Document{}
	if err := document.FillFromArguments(stub, args); err != nil {
		message := fmt.Sprintf("cannot fill a document from arguments: %s", err.Error())
		logger.Error(message)
		return shim.Error(message)
	}

	document.Key.DocumentID = args[0]

	if document.ExistsIn(stub, "") {
		compositeKey, _ := document.ToCompositeKey(stub)
		return shim.Error(fmt.Sprintf("document with the key %s already exists", compositeKey))
	}

	if bytes, err := json.Marshal(document); err == nil {
		logger.Debug("Document: " + string(bytes))
	}

	document.Value.Timestamp = time.Now().UTC().Unix()

	if err := UpdateOrInsertIn(stub, &document, ""); err != nil {
		message := fmt.Sprintf("persistence error: %s", err.Error())
		logger.Error(message)
		return pb.Response{Status: 500, Message: message}
	}

	result, err := json.Marshal(document.Key)
	if err != nil {
		return shim.Error(err.Error())
	}

	logger.Info("##### IPFS.createDocument exited without errors. #####")
	logger.Debug("Success: IPFS.createDocument")

	return shim.Success(result)
}

func getDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//     0
	//"DocumentID"
	logger.Info("##### IPFS requestDocumentFromPatient is running. #####")
	logger.Debug("IPFS.getDocument")

	document := Document{}
	if err := document.FillFromCompositeKeyParts(args[:documentKeyFieldsNumber]); err != nil {
		message := fmt.Sprintf(err.Error())
		return pb.Response{Status: 404, Message: message}
	}

	if !document.ExistsIn(stub, "") {
		compositeKey, _ := document.ToCompositeKey(stub)
		message := fmt.Sprintf("document with the key %s doesn't exist", compositeKey)
		return pb.Response{Status: 404, Message: message}
	}

	if err := LoadFrom(stub, &document, ""); err != nil {
		message := fmt.Sprintf("persistence error: %s", err.Error())
		logger.Error(message)
		return pb.Response{Status: 500, Message: message}
	}

	result, err := json.Marshal(document)
	if err != nil {
		return shim.Error(err.Error())
	}

	logger.Debug("Result: " + string(result))
	logger.Info("##### IPFS.getDocument exited without errors. #####")
	logger.Debug("Success: IPFS.getDocument")
	return shim.Success(result)
}

func getDocuments(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("##### IPFS getDocuments is running. #####")
	logger.Debug("IPFS.getDocuments")

	documentsBytes, err := Query(stub, documentIndex, []string{}, CreateDocument, EmptyFilter, []string{""})
	if err != nil {
		message := fmt.Sprintf("unable to perform getDocuments: %s", err.Error())
		logger.Error(message)
		return shim.Error(message)
	}

	logger.Info("##### IPFS.getDocuments exited without errors. #####")
	logger.Debug("Success: IPFS.getDocuments")
	return shim.Success(documentsBytes)
}

func updateDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	//  0	    		1		 2            3
	// "DocumentID"  "Type"	"Description"  "HashDoc"
	logger.Info("##### IPFS updateDocument is running. #####")
	logger.Debug("IPFS.updateDocument")

	document := Document{}
	if err := document.FillFromArguments(stub, args); err != nil {
		message := fmt.Sprintf("cannot fill a document from arguments: %s", err.Error())
		logger.Error(message)
		return shim.Error(message)
	}

	documentToUpdate := Document{}
	documentToUpdate.Key.DocumentID = args[0]

	if !documentToUpdate.ExistsIn(stub, "") {
		compositeKey, _ := document.ToCompositeKey(stub)
		return shim.Error(fmt.Sprintf("document with the key %s doesn't exist", compositeKey))
	}

	if err := LoadFrom(stub, &documentToUpdate, ""); err != nil {
		message := fmt.Sprintf("persistence error: %s", err.Error())
		logger.Error(message)
		return pb.Response{Status: 500, Message: message}
	}

	documentToUpdate.Value.DocumentType = document.Value.DocumentType
	documentToUpdate.Value.DocumentHash = document.Value.DocumentHash
	documentToUpdate.Value.DocumentDescription = document.Value.DocumentDescription
	documentToUpdate.Value.Updated = time.Now().UTC().Unix()

	if bytes, err := json.Marshal(documentToUpdate); err == nil {
		logger.Debug("Document: " + string(bytes))
	}

	if err := UpdateOrInsertIn(stub, &documentToUpdate, ""); err != nil {
		message := fmt.Sprintf("persistence error: %s", err.Error())
		logger.Error(message)
		return pb.Response{Status: 500, Message: message}
	}

	result, err := json.Marshal(document.Key)
	if err != nil {
		return shim.Error(err.Error())
	}

	logger.Info("##### IPFS.updateDocument exited without errors. #####")
	logger.Debug("Success: IPFS.updateDocument")

	return shim.Success(result)
}