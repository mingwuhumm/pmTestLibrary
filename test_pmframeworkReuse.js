if (typeof PMFrameUtil === "undefined") {
    let globalEval = eval;

    PMFrameUtil = function () {
        let self = this;
        const testMsg = function()
        {
            this.getText = () => {
            return "This is the secondlibrary"}
        }
       
          this.testText=new testMsg();

        const executeReferencedRequest =
          function ({ collectionUUID, requestName }, callback) {
            var _ = require('lodash');
            const API_KEY = "<API-KEY>";
              
            pm.sendRequest({
              "method": "GET",
              "header": [{
                "key": "x-api-key",
                "value": API_KEY,
                "type": "text"
              }],
              "url": {
                "raw": `https://api.getpostman.com/collections/${collectionUUID}`,
                "protocol": "https",
                "host": [
                  "api",
                  "getpostman",
                  "com"
                ],
                "path": [
                  "collections",
                  collectionUUID
                ]
              }
            }, function (err, response) {
              if(err) {
                console.error("Unable to fetch the referenced request", err);
                callback && callback(err, null);
                return;
              }
              let collection = response.json().collection;
                
              function processCollectionRequest(tree, identifier) {
                if(tree.name === identifier){
                    return tree;
                }
                else if (!_.isEmpty(tree.item)){
                  var result;
                  for(let i = 0; !result && i < tree.item.length; i++) {
                    result = processCollectionRequest(tree.item[i], identifier);
                    if(result) {
                      
                      // Extend prerequest and test scripts with collection and folder level scripts
                      let nodePreRequestScript = _.find(result.event, {listen: "prerequest"}),
                        parentPreRequestScript = _.find(tree.event, {listen: "prerequest"}),
                        nodeTestScript = _.find(result.event, {listen: "test"}),
                        parentTestScript = _.find(tree.event, {listen: "test"});
                      
                      nodePreRequestScript ?
                      (nodePreRequestScript.script.exec = _.concat(
                        parentPreRequestScript && parentPreRequestScript.script.exec,
                        nodePreRequestScript.script.exec
                      )) :
                      (nodePreRequestScript = parentPreRequestScript);
                      
                      nodeTestScript ?
                      (nodeTestScript.script.exec = _.concat(
                        parentTestScript && parentTestScript.script.exec,
                        nodeTestScript.script.exec
                      )) :
                      (nodeTestScript = parentTestScript);
                      
                      result.event = _.compact(_.concat(nodePreRequestScript, nodeTestScript));
                      
                      //Inherit authoriztion from parent chain
                      if(!result.request.auth && tree.auth) {
                        result.request.auth = tree.auth
                      }
                    }
                  }
                  return result;
                }
                return;
              }
                
              _.forEach(collection.variables, function (variable) {
                  pm.collectionVariables.set(variable.key, variable.value);
              });
                
              let referencedRequest = processCollectionRequest(collection, requestName),
                preRequestScript = _.find(referencedRequest.event, {listen: "prerequest"}),
                testScript = _.find(referencedRequest.event, {listen: "test"});
                
            
              // Execute pre-request script of the request being executed
              pm.variables.set("referencedPreRequestScript", preRequestScript && preRequestScript.script.exec.join("\n"));
              pm.variables.set("referencedTestScript", testScript && testScript.script.exec.join("\n"));
              pm.variables.set("referencedRequest", referencedRequest && referencedRequest.request);
              callback && callback(null, collection);
            });
          }

          this.reuseRequst=new executeReferencedRequest("aa","bb");
    }


    pmframeUtil = new PMFrameUtil()

    log = pmframeUtil.log;
    if (typeof init === "function") {
        log("Running the init function")
        init();
    } 
} else {
    log("pmframeUtil already loaded");

}

