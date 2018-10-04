const handlebars = require('handlebars');
const fs = require('fs');

// Templating all the partials
const partial_dir = "./layout/partials";
fs.readdir(partial_dir, (err, partialFiles) => {
	if (!err) {
		console.log(partialFiles);

		let partialText, partialTemplate, partialName;

		partialFiles.forEach((p) => {
			partialText = fs.readFileSync('./layout/partials/' + p).toString('utf-8');
			partialTemplate = handlebars.compile(partialText);

			partialName = p.slice(0, -4);
			console.log(partialName);
			handlebars.registerPartial(partialName, partialTemplate);
		});
	}
	else { throw err; }


	// Templating index that uses partials
	const hbs = fs.readFileSync('./layout/index.hbs').toString('utf-8')
	const template = handlebars.compile(hbs);
	//console.log(hbs + "\n");

	const jsonData = JSON.parse(fs.readFileSync('content.json'));
	//console.log(jsonData + "\n");

	const result = template(jsonData);
	//console.log(result);

	fs.writeFileSync('index.html', template(jsonData));

});




/*
const footer = fs.readFileSync('./layout/partials/footer.hbs').toString('utf-8')
const templateFooter = handlebars.compile(footer);
handlebars.registerPartial('footer', templateFooter);
*/
