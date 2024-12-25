"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Server = (0, express_1.express)();
const portURI = process.env.PORT_URI_SERVER || 3000;
Server.listen(portURI, function () {
    console.log("Servidor online na porta: ", portURI);
});
