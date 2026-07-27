function DatasetSize(name) {
    function Viev(term) {
        if (term == null) {return 0}
        return Viev(term[Object.keys(term)[0]]) + 1;
    }
    return Viev(FileData["Datasets"][name])    
}

function DatasetLevelCount(name) {
    if (name[0] != "!") {
        return 0
    }
    return DatasetLevelCount(name.slice(1)) + 1
}

function DatasetReference(name) {
    return name.replaceAll("!", "").split("]", 1)[0].replace("[", "");
}
function DatasetName(name) {
    return name.replaceAll("!", "").split("]").reverse()[0];
}

function DatasetPath(name) {
    if (!name.startsWith("!!")) {
        return [DatasetName(name)]
    }
    let reference = DatasetReference(name);
    let referenceIndx = ColumnInx(reference);
    return DatasetPath(columnsType[referenceIndx]).push(reference);
    
}