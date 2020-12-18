function hills() {
	var canvas = document.querySelector('canvas#hills');
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "rgba(159, 124, 88, 0.9)";
	
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	
	var vw = canvas.width/100;
	var vh = canvas.height/100;
	
	var triangles = new Array();
	
	var prev = -1000;
	
	for(var i = 0; i < 40; i++) {
		var height = Math.floor(Math.random() * 40) + 60;
		var width = Math.floor(Math.random() * 30) + 20;
		
		var p1 = new Point(prev*vw, 100*vh);
		var p2 = new Point((prev+width)*vw, (100-height)*vh);
		var p3 = new Point((prev+width+width)*vw, 100*vh);
		
		triangles.push([p1, p2, p3]);
		prev += 2*width - 10;
	}
	
	var totalWidth = 0;
	
	for(var i = 0; i < triangles.length; i++) {
		totalWidth += (triangles[i][2].x/vw - triangles[i][0].x/vh) - 10;
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		for(var i = 0; i < triangles.length; i++) {
			if(triangles[i][0].x < canvas.width*(1+Math.random()))
			for(var j = 0; j < triangles[i].length; j++) {
				triangles[i][j].x++;
			}
			else
			for(var j = 0; j < triangles[i].length; j++) {
				triangles[i][j].x -= 5*canvas.width;
			}
		}
		
		for(var i = 0; i < triangles.length; i++) {
			ctx.beginPath();
			ctx.moveTo(triangles[i][0].x, triangles[i][0].y);
			for(var j = 1; j < triangles[i].length; j++) {
				ctx.lineTo(triangles[i][j].x, triangles[i][j].y);
			}	
			
			ctx.fill();
		}
		
		requestAnimationFrame(draw);
	}
	
	requestAnimationFrame(draw);
}

hills();

function stars() {
	var canvas = document.querySelector('canvas#stars');
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	var ctx = canvas.getContext("2d");
	
	function drawStar(x, y) {
		ctx.beginPath();
		ctx.moveTo(x+0, y+0);
		ctx.fillStyle = "#fff";
		
		ctx.fillRect(x, y, 1.5, 1.5);
	}
	
	var starCount = 30;
	
	var stars = new Array(starCount);
	
	for(var i = 0; i < starCount; i++) {
		stars[i] = new Array(2);
		stars[i][0] = Math.floor(Math.random() * canvas.width) + 1;
		stars[i][1] = Math.floor(Math.random() * canvas.height) + 1;
		
		drawStar(stars[i][0], stars[i][1]);
	}
	
	function drawAll() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		for(var i = 0; i < starCount; i++) {
			stars[i][0] = stars[i][0] <= 0 ? canvas.width : stars[i][0] -= 0.5;
			stars[i][1] = stars[i][1] >= canvas.height ? 0 : ++stars[i][1];
			
			drawStar(stars[i][0], stars[i][1]);
		}
		requestAnimationFrame(drawAll);
	}
	
	requestAnimationFrame(drawAll);
}

stars();

function balls() {
	let canvas = document.querySelector('canvas#balls');
	
	let ctx = canvas.getContext('2d');
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	let floorSize = 20;
	let floorY = canvas.height - floorSize;
	
	let balls = [];
	const radius = 40;
	const vStep = 5;
	
	function Ball(x, color) {
		this.x = x;
		this.y = floorY - radius;
		this.color = color;
		this.v = 0;
		this.hittingBall = b => {
			return Math.abs(b.x - this.x) < 2*radius;
		}
		this.draw = () => {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
			ctx.fill();
		}
		this.vString = () => {
			if(this.v < 0) {
				return (-this.v) + " pixels/sec leftward"; 
			}
			else if(this.v > 0) {
				return this.v + " pixels/sec rightward";
			}
			else {
				return "0 pixels/sec";
			}
		}
	}
	
	let b1 = new Ball((canvas.width / 2) + 2*radius, 'red');
	let b2 = new Ball((canvas.width / 2) - 2*radius, 'blue');
	
	b1.draw();
	b2.draw();
	
	function update() {
		function updateOne(b) {
			b.x += b.v;
			if(b.x <= radius) {
				b.v = Math.abs(b.v);
			}
			if(b.x >= canvas.width - radius) {
				b.v = -1 * Math.abs(b.v);
			}
		}
		
		updateOne(b1);
		updateOne(b2);
		
		if(b1.hittingBall(b2)) {
			var temp = b1.v;
			b1.v = b2.v;
			b2.v = temp;
		}
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		b1.draw();
		b2.draw();
		ctx.fillStyle = "black";
		ctx.fillRect(0, floorY, canvas.width, floorSize);
		
		document.querySelector('#red-vel').innerHTML = b1.vString();
		document.querySelector('#blue-vel').innerHTML = b2.vString();
		
		requestAnimationFrame(update);
	}
	
	requestAnimationFrame(update);
	
	document.querySelector('#red-left').addEventListener('click', e => {
		e.preventDefault();
		b1.v -= vStep;
	});
	document.querySelector('#red-right').addEventListener('click', e => {
		e.preventDefault();
		b1.v += vStep;
	});
	document.querySelector('#blue-left').addEventListener('click', e => {
		e.preventDefault();
		b2.v -= vStep;
	});
	document.querySelector('#blue-right').addEventListener('click', e => {
		e.preventDefault();
		b2.v += vStep;
	});
	document.querySelector('#reset').addEventListener('click', e => {
		e.preventDefault();
		b2.v = b1.v = 0;
	});
}

balls();

function weight() {
	const text = document.querySelector('#earth-weight');
	
	text.addEventListener('keyup', e => {
		const earth = Number(text.value);
		const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
		document.querySelector('#weight-output').innerHTML = 'Using a weighing scale from Earth, you would weigh ' + round(0.3784*earth) + ' kg on Mars, and ' + round(0.1651*earth) + ' kg on the Moon!';
	});
}

weight();

if(window.innerWidth < 1100) {
	alert('Hi! This final project is best experienced on a bigger screen. Thank you for understanding!');
}
