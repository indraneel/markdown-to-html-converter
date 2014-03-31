var RUMA = RUMA || function () {

    var exec = require('child_process').exec; //need this for running cmd line commands
    var fs = require('fs'); //need this for filesys access
    var marked = require('marked');

    var overwrite = fs.existsSync('./index.html');
    console.log("over write = " + overwrite);

    var getContent = function () {
	var output;
	try {
	    output = fs.readFileSync('./test.markdown').toString();
	} catch (e) {
	    if (e.code === 'ENOENT') {
		console.log("File not found!");
	    } else {
		console.log('throwing e');
		throw e;
	    }
	}
	return output;
    };

    var splitIntoSections = function(input) {
	var sections = {};
	var currentSectionHeader = "";
	input.split("\n").forEach( function(line) {
	    var sectionHeader = line.match(/\{\{|.\}\}/);
	    if (sectionHeader) {
		currentSectionHeader = line;
		sections[line] = "";

	    }
	    else {
		if (line === "") {

		} else {
		    //console.log("content line:\t"+marked(line)); 
		    var insert = marked(line).replace(/\n/g,'');
		    sections[currentSectionHeader] += insert;
		}
	    }

	});
	//console.log("whole object\n"+ JSON.stringify(sections));
	return sections;
    }


    var injectMarkdown = function(sections) {	
	var i =0;
	fs.readFileSync('./template.html').toString().split("\n").forEach( function(line) {
	    var sectionContent = "";
	    for (var key in sections) {
		if (line.indexOf(key) != -1) {
		    sectionContent = sections[key];
		    console.log("line = " + line + "\n content = " + sectionContent);
		    break;
		}
		else {
		    sectionContent = line;
		}
	    }

	    if (overwrite) {
		try {
		    fs.writeFileSync('./index.html', sectionContent+"\n");     
		} catch (e) {
		    console.log(e);
		}
		overwrite = false;
	    }
	    else {
		try {
		    fs.appendFileSync('./index.html', sectionContent+"\n");
		} catch (e) {
		    console.log(e);
		}
	    }

	    i++;
	});
    }


    injectMarkdown(splitIntoSections(getContent()));
    
}();


