var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/* THIS IS THE STUDENT LOGIC */
var student = {
	firstName: String(),
	lastInitial: String(),
	school: String(),
	badges: Array(),
	// maybe password: String()
};
/*
	File is structured as:

	[firstName,lastInitial,school]\n
	[firstName,lastInitial,school]*/

var students;
var getStudents = function(){
	try{
		students = fs.readFileSync('students.txt','utf8').split('\n').map(JSON.parse);
	} catch(e) {
		console.log(e);
		students = [];
	}
};

getStudents();

var createNewStudent = function(name,lastInitial,school){
	console.log ('Created a new student:',`["${name}","${lastInitial}","${school}",[]]`);
	fs.appendFileSync('students.txt',`\n["${name}","${lastInitial}","${school}",[]]`);
};

console.log(students);


/* THIS IS THE SERVER LOGIC*/
server.listen(8000);

app.get('*', function (req, res) {
	if (req.url === 'students.txt'){
		res.write('Permission Denied');
	}
  	res.sendFile(__dirname + '/' + req.url);
});

io.on('connection', function (socket) {
  socket.on('makeStudent',function(s){
  	console.log('Tried:',s);
  	getStudents();
  	for (var i = 0; i < students.length;i++){
  		if (s[2] === students[2] && s[1] === students[1] && s[0] === students[0]){
  			socket.emit('duplicate','We already have a student with the same information.');
  			return;
  		}
  	}
  	createNewStudent(s[0],s[1],s[2]);
  });
});