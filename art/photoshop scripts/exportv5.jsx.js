#target photoshop

// Function to sanitize file and folder names (remove dashes and underscores)
function sanitizeName(name) {
    return name.replace(/[-_]/g, "");
}

// Function to export a layer as a PNG
function exportLayer(layer, folderPath) {
    var fileName = sanitizeName(layer.name) + ".png";
    var filePath = folderPath + "/" + fileName;

    var exportOptions = new ExportOptionsSaveForWeb();
    exportOptions.format = SaveDocumentType.PNG;
    exportOptions.PNG8 = false;
    exportOptions.transparency = true;
    
    var tempDoc = app.activeDocument.duplicate();
    app.activeDocument = tempDoc; // Ensure the duplicate is the active document

    // Hide all layers except the current one
    for (var i = tempDoc.layers.length - 1; i >= 0; i--) {
        tempDoc.layers[i].visible = false;
    }
    layer.visible = true;

    tempDoc.exportDocument(new File(filePath), ExportType.SAVEFORWEB, exportOptions);
    tempDoc.close(SaveOptions.DONOTSAVECHANGES);
}

// Main function to process all layers
function processLayers(layers, parentGroupName, outputFolder) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.typename === "ArtLayer") {
            var groupName = parentGroupName ? sanitizeName(parentGroupName) : "Ungrouped";
            var groupFolder = new Folder(outputFolder + "/" + groupName);
            if (!groupFolder.exists) {
                groupFolder.create();
            }
            exportLayer(layer, groupFolder.fsName);
        } else if (layer.typename === "LayerSet") {
            var groupFolderName = parentGroupName ? parentGroupName + "/" + layer.name : layer.name;
            processLayers(layer.layers, groupFolderName, outputFolder);
        }
    }
}

// Script execution starts here
(function () {
    if (!documents.length) {
        alert("No document is open. Please open a document and try again.");
        return;
    }

    var doc = app.activeDocument;
    var outputFolder = Folder.selectDialog("Select the folder to export layers to");

    if (!outputFolder) {
        alert("No folder selected. Script canceled.");
        return;
    }

    processLayers(doc.layers, "", outputFolder.fsName);
    alert("Export completed!");
})();
