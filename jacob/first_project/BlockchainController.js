/**
 *          BlockchainController
 *
 * This class expose the endpoints that the client applications will use to interact with the
 * Blockchain dataset
 */
const e = require("express");

class BlockchainController {

    //The constructor receive the instance of the express.js app and the Blockchain class
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.validateChain();
    }

    // Enpoint to Get a Block by Height (GET Endpoint)
    // curl http://localhost:8000/block/height/0
    getBlockByHeight() {
        this.app.get("/block/height/:height", async (req, res) => {
            if (req.params.height) {
                const height = parseInt(req.params.height);
                let block = await this.blockchain.getBlockByHeight(height);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }

        });
    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    // curl -i -X POST -H 'Content-Type: application/json' -d '{"address":"mzY9avi4UUJBMgwuWvmBcEsNsSLKKxYGN5"}' http://localhost:8000/requestValidation
    requestOwnership() {
        this.app.post("/requestValidation", async (req, res) => {
            if (req.body.address) {
                const address = req.body.address;
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if (message) {
                    return res.status(200).json(message);
                } else {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)
    // curl -i -X POST -H 'Content-Type: application/json'
    // -d '{"address":"mzY9avi4UUJBMgwuWvmBcEsNsSLKKxYGN5", "signature":"H/S2H9cYh0oNEsgee9by42BNCOoO1LZzFRjyiUli1e7MJesgeg/vHY5Ycm3a0fguaoOg11jr4CWTtl8SAq/UxSI=", "message":"mzY9avi4UUJBMgwuWvmBcEsNsSLKKxYGN5:1636219719:starRegistry","star": {"dec": "68° 52' 56.9", "ra": "16h 29m 1.0s", "story": "Testing the story 4"}}'
    // http://localhost:8000/submitstar
    submitStar() {
        this.app.post("/submitstar", async (req, res) => {
            if (req.body.address && req.body.message && req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                try {
                    let block = await this.blockchain.submitStar(address, message, signature, star);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        console.log(`An error has occured while submitting star`)
                        return res.status(500).send("An error happened!");
                    }
                } catch (error) {
                    console.log(`An error has occured while submitting star: ${error}`)
                    return res.status(500).send(error);
                }
            } else {
                console.log(`An error has occurred while submitting star: Check the Body Parameter!`)
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // This endpoint allows you to retrieve the block by hash (GET endpoint)
    // curl http://localhost:8000/block/hash/a1172b678e76e738d9e73a28a740bf12f30aa3a616c3f9adca967666cca819e1
    getBlockByHash() {
        this.app.get("/block/hash/:hash", async (req, res) => {
            if (req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlockByHash(hash);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }

        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    // curl http://localhost:8000/blocks/mzY9avi4UUJBMgwuWvmBcEsNsSLKKxYGN5
    getStarsByOwner() {
        this.app.get("/blocks/:address", async (req, res) => {
            if (req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if (stars) {
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Block Not Found! Review the Parameters!");
            }

        });
    }

    // curl http://localhost:8000/validatechain
    validateChain() {
        this.app.get("/validateChain", async (req, res) => {
            let errors = await this.blockchain.validateChain()
            if (errors) {
                return res.status(500).json("Blockchain validated. Errors found: " + errors);
            } else {
                return res.status(200).send("Blockchain validated. No errors found");
            }
        })
    }

}

module.exports = (app, blockchainObj) => {
    return new BlockchainController(app, blockchainObj);
}