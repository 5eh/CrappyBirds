#target photoshop

// Function to sanitize file and folder names
function sanitizeName(name) {
    try {
        // Ensure name is a valid string
        if (typeof name !== "string" || !name) {
            name = "Layer"; // Default fallback for invalid names
        }
        return name
            .toString() // Ensure it's a string
            .replace(/[:\/\\*\?\"\<\>\|]/g, "") // Remove invalid characters
            .replace(/[\s]+/g, " ") // Replace multiple spaces with a single space
            .trim(); // Trim leading/trailing spaces
    } catch (error) {
        $.writeln("Error sanitizing name: " + error.message);
        return "Layer"; // Fallback if sanitization fails
    }
}

// Function to export a single layer
function exportLayer(layer, folderPath, parentGroups) {
    try {
        var fileName = sanitizeName(layer.name) + ".png";
        var filePath = folderPath + "/" + fileName;

        // Save the visibility states of all layers
        var doc = app.activeDocument;
        var visibilityStates = [];
        for (var i = 0; i < doc.layers.length; i++) {
            visibilityStates.push(doc.layers[i].visible);
            doc.layers[i].visible = false; // Hide all layers
        }

        // Make parent groups visible
        for (var i = 0; i < parentGroups.length; i++) {
            parentGroups[i].visible = true;
        }

        // Make the current layer visible
        layer.visible = true;

        // Duplicate the document for exporting
        var tempDoc = doc.duplicate();
        tempDoc.flatten();

        // Save the layer as PNG
        var exportOptions = new ExportOptionsSaveForWeb();
        exportOptions.format = SaveDocumentType.PNG;
        exportOptions.PNG8 = false;
        exportOptions.transparency = true;

        tempDoc.exportDocument(new File(filePath), ExportType.SAVEFORWEB, exportOptions);
        tempDoc.close(SaveOptions.DONOTSAVECHANGES);

        // Restore the visibility states
        for (var i = 0; i < doc.layers.length; i++) {
            doc.layers[i].visible = visibilityStates[i];
        }
    } catch (error) {
        $.writeln("Error exporting layer: " + error.message);
    }
}

// Recursive function to process layers
function processLayers(layers, parentGroupName, outputFolder, parentGroups) {
    for (var i = 0; i < layers.length; i++) {
        try {
            var layer = layers[i];

            if (layer.typename === "ArtLayer") {
                // Create a folder for the parent group
                var groupName = parentGroupName ? sanitizeName(parentGroupName) : "Ungrouped";
                var groupFolder = new Folder(outputFolder + "/" + groupName);
                if (!groupFolder.exists) {
                    groupFolder.create();
                }

                // Export the individual layer
                exportLayer(layer, groupFolder.fsName, parentGroups);
            } else if (layer.typename === "LayerSet") {
                // Add the current group to the parent groups list
                parentGroups.push(layer);

                // Process sublayers recursively
                var groupFolderName = parentGroupName ? parentGroupName + "/" + layer.name : layer.name;
                processLayers(layer.layers, groupFolderName, outputFolder, parentGroups);

                // Remove the current group from the parent groups list
                parentGroups.pop();
            }
        } catch (error) {
            $.writeln("Error processing layer: " + error.message);
        }
    }
}

// Script execution starts here
(function () {
    try {
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

        // Start processing layers
        processLayers(doc.layers, "", outputFolder.fsName, []);

        alert("Export completed!");
    } catch (error) {
        $.writeln("Script error: " + error.message);
        alert("An error occurred. Check the JavaScript Console for details.");
    }
})();
