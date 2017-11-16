/*!
 * quachan
 * Copyright(c) 2017 93725638
 * MIT Licensed
 */

(async () => {
    process.on("unhandledRejection", (err, promise) => {
        console.error("An unhandledRejection occurred");
    
        console.error("Rejected Promise:", promise);
    
        console.error("Rejection:", err);
    });

    await require("./database.js").default;
    require("./www.js");
})();
