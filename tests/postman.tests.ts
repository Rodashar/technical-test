/// <reference types="@types/postman-collection" />

declare const pm: any;

pm.test("Replace 'dog' with 'cat' in simple text", function () {
    var requestBody = { text: "I have a dog." };
    var expectedResponse = { text: "I have a cat." };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Respect maxReplacements limit", function () {
    var requestBody = { text: "dog dog dog dog dog dog dog" };
    var expectedResponse = { text: "cat cat cat cat cat dog dog" };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle nested objects", function () {
    var requestBody = {
        level1: {
            level2: {
                message: "dog in nested object"
            }
        }
    };
    var expectedResponse = {
        level1: {
            level2: {
                message: "cat in nested object"
            }
        }
    };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle arrays", function () {
    var requestBody = {
        animals: ["dog", "dog lover", "another dog"]
    };
    var expectedResponse = {
        animals: ["cat", "cat lover", "another cat"]
    };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle case-insensitive matching", function () {
    var requestBody = { text: "Dog DOG dOg" };
    var expectedResponse = { text: "cat cat cat" };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle non-string values", function () {
    var requestBody = {
        number: 123,
        boolean: true,
        null: null
    };
    var expectedResponse = {
        number: 123,
        boolean: true,
        null: null
    };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle empty request body", function () {
    var requestBody = {};
    var expectedResponse = {};
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle inputs with no occurrences of the target animal", function () {
    var requestBody = { text: "I have a fish" };
    var expectedResponse = { text: "I have a fish" };
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});

pm.test("Handle invalid inputs gracefully", function () {
    var requestBody = null;
    var expectedResponse: null = null;
    pm.sendRequest({
        url: pm.environment.get("apiBaseUrl") + "/replace-animal",
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: { mode: "raw", raw: JSON.stringify(requestBody) }
    }, function (err: any, res: any) {
        pm.expect(err).to.eql(null);
        pm.expect(res).to.have.property("code", 200);
        pm.expect(res.json()).to.eql(expectedResponse);
    });
});