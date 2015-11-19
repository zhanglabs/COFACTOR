var pv = require("bio-pv");

var applicationName = '3D community viewer'; //please provide a name for your application
var clientInfo='Daniel Teixeira';
var nx = new Nextprot.Client(applicationName, clientInfo);

var viewer = pv.Viewer(document.getElementById('gl'), {
    quality: 'high',
    width: 'auto',
    height: 'auto',
    antialias: true,
    outline: true
});

var structure;

function lines() {
    viewer.clear();
    viewer.lines('structure', structure);
}

function cartoon() {
    viewer.clear();
    viewer.cartoon('structure', structure, {
        color: pv.color.ssSuccession()
    });
}

function lineTrace() {
    viewer.clear();
    viewer.lineTrace('structure', structure);
}

function sline() {
    viewer.clear();
    viewer.sline('structure', structure);
}

function tube() {
    viewer.clear();
    viewer.tube('structure', structure);
}

function trace() {
    viewer.clear();
    viewer.trace('structure', structure);
}

function preset() {
    viewer.clear();
    var ligand = structure.select({
        rnames: ['RVP', 'SAH']
    });
    viewer.ballsAndSticks('ligand', ligand);
    viewer.cartoon('protein', structure);
}



function load(pdbId) {

  /*var url = 'http://www.rcsb.org/pdb/files/' + pdbId + '.pdb';
  if(nx.getEnvironment() !== "pro"){*/
  var url = nx.getApiBaseUrl() + "/pdb/" + pdbId;
  //}

    pv.io.fetchPdb(url, function (molecule) {
        structure = molecule;
        cartoon();
        // set camera orientation to pre-determined rotation, zoom and
        // center values that are optimal for this very molecule
        var rotation = [
       0.1728139370679855, 0.1443438231945038, 0.974320650100708,
       0.0990324765443802, 0.9816440939903259, -0.162993982434272,
      -0.9799638390541077, 0.1246569454669952, 0.155347332358360
    ];
        //var center = [6.514, -45.571, 2.929];
        var center = [0, 0, 0];
        viewer.setCamera(rotation, center, 100);
        $(".dots-loader").hide();
        $("#gl").show();
    });
}




document.getElementById('cartoon').onclick = cartoon;
document.getElementById('line-trace').onclick = lineTrace;
document.getElementById('preset').onclick = preset;
document.getElementById('lines').onclick = lines;
document.getElementById('trace').onclick = trace;
document.getElementById('sline').onclick = sline;
document.getElementById('tube').onclick = tube;

window.onresize = function (event) {
    viewer.fitParent();
}

$.getJSON("https://api.nextprot.org/entry/" + nx.getEntryName() + "/identifier.json", function (data) {
    var firstPDBValue = null;
    data.entry.identifiers.forEach(function (id) {
        if (id.type === "PDB") {
            $('#pdbList').append($("<option></option>").val(id.name).html(id.name));
            if (firstPDBValue == null) firstPDBValue = id.name;
        }
    });
    if (firstPDBValue != null) {
        $(".dots-loader").show();
        $("#gl").hide();
        viewer.on('viewerReady', load(firstPDBValue));
    } else {
        $('#pdbList').append($("<option></option>").val("N/A").html("N/A"));
        $(".dots-loader").hide();
    }
});


$("#pdbList").change(function (elem) {
    $("#gl").hide();
    $(".dots-loader").show();
    viewer.on('viewerReady', load(this.value));
});
