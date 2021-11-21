if (typeof PMUtil === "undefined") {
    let globalEval = eval;

    PMUtil = function () {
        let self = this;
        const testMsg = function()
        {
            this.getText = () => {
            return "Hello Postman QA"}
        }
        this.returnTestMsg=new testMsg();
    }
    pmutil = new PMUtil()

    log = pmutil.log;
    if (typeof init === "function") {
        log("Running the init function")
        init();
    } 
} else {
    log("PMUtils already loaded");

}


