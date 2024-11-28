// Prompt user to select an output folder
var outputFolder = Folder.selectDialog("Select Output Folder");
if (!outputFolder) {
    alert("You must select an output folder!");
    throw "No output folder selected.";
}

// Function to sanitize file names (remove dashes and other unwanted characters)
function sanitizeFileName(name) {
    return name.replace(/-/g, "_").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}

// Function to hide all layers
function hideAllLayers(layers) {
    for (var i = 0; i < layers.length; i++) {
        layers[i].visible = false;
        if (layers[i].typename === "LayerSet") {
            hideAllLayers(layers[i].layers);
        }
    }
}

// Function to save the current visible layer as a PNG
function saveLayer(layer, groupName, outputFolder) {
    // Create a subfolder for the group
    var groupFolder = new Folder(outputFolder + "/" + groupName);
    if (!groupFolder.exists) groupFolder.create();

    // Generate sanitized file name and path
    var fileName = sanitizeFileName(layer.name) + ".png";
    var filePath = groupFolder + "/" + fileName;

    // Save as PNG
    var pngOptions = new PNGSaveOptions();
    var file = new File(filePath);
    app.activeDocument.saveAs(file, pngOptions, true, Extension.LOWERCASE);
}

// Function to process a single layer (make it visible and save)
function processSingleLayer(layer, groupName) {
    hideAllLayers(app.activeDocument.layers); // Hide all layers first
    layer.visible = true; // Show the current layer
    saveLayer(layer, groupName, outputFolder); // Save the layer as PNG
}

// Recursive function to process all visible layers, one by one
function processVisibleLayers(layers, groupName) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.visible) { // Process only if the layer or group is visible
            if (layer.typename === "ArtLayer") {
                // If it's a visible ArtLayer, process it
                processSingleLayer(layer, groupName);
            } else if (layer.typename === "LayerSet") {
                // If it's a visible LayerSet, process its children
                processVisibleLayers(layer.layers, groupName + "/" + sanitizeFileName(layer.name));
            }
        }
    }
}

// Main function to handle the export process and restore visibility
function exportAllVisibleLayers() {
    // Save original visibility states
    var visibilityState = [];
    function saveVisibilityState(layers) {
        for (var i = 0; i < layers.length; i++) {
            visibilityState.push({ layer: layers[i], visible: layers[i].visible });
            if (layers[i].typename === "LayerSet") {
                saveVisibilityState(layers[i].layers);
            }
        }
    }

    // Restore visibility states
    function restoreVisibilityState() {
        for (var i = 0; i < visibilityState.length; i++) {
            visibilityState[i].layer.visible = visibilityState[i].visible;
        }
    }

    // Save and process layers
    saveVisibilityState(app.activeDocument.layers);
    try {
        processVisibleLayers(app.activeDocument.layers, "Root");
    } finally {
        restoreVisibilityState(); // Ensure all visibility is restored
    }
}

// Run the script
exportAllVisibleLayers();

alert("Export complete!");
