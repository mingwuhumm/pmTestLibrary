if (typeof PMFrameUtil === "undefined") {
    let globalEval = eval;

    PMFrameUtil = function () {
        let self = this;
        const testMsg = function()
        {
            this.getText = () => {
            return "This is the code from secondlibrary"}
        }
       
          this.testText=new testMsg();

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
