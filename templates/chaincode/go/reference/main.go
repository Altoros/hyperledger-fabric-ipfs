package main

import (
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

var logger = shim.NewLogger("IPFSChaincode")
// Simple chaincode
type Chaincode struct {
}

func (cc *Chaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Init")
	return shim.Success(nil)
}

func (cc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Debug("Invoke")

	fcn, args := stub.GetFunctionAndParameters()

		if fcn == "createDocument" {
			return createDocument(stub, args)
		} else if fcn == "getDocument" {
			return getDocument(stub, args)
		} else if fcn == "getDocuments" {
			return getDocuments(stub, args)
		} else if fcn == "updateDocument" {
			return updateDocument(stub, args)
		}

	return pb.Response{Status: 403, Message: "Invalid invoke function name."}
}

func main() {
	err := shim.Start(new(Chaincode))
	if err != nil {
		logger.Error(err.Error())
	}
}
