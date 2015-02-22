
var ConfigurationScreen = Screen.extend({
    initialize: function(){
        // Generate a 
    },
    open: function(ctx)
    {
        Screen.prototype.open.apply(this, arguments);
    },
    getMessages: function(){
    }
});

var Message = Backbone.Model.extend({
    defaults: {
        "message": "Missing message"
    }
});

var ConfigurationMessages = Backbone.Model.extend({
    model: Message
});

var Car = Backbone.Model.extend({

});

/**
 * A full game stage
 * 
 * should trigger a 
 */
var Stage = Backbone.Model.extend({
    initialize: function(){},
    surfaces: function(){}
});

/**
 * Surfaces that the car can rest upon
 */
var Surface = Backbone.Model.extend({

});

var inputpoint=0;
var AJAXvar="";
var ctrls=new Array(4);
var keys=new Array(4);

var message=new Array(4);
message[0]="press the key for up";
message[1]="press the key for down";
message[2]="press the key for left";
message[3]="press the key for right";

var onSurface=true;

var speedx=0;
var speedy=0;
var speedz=0;

var forcex=0;
var forcey=0;
var forcez=0;

var appForce=0;
var xRotSpeed=0;
var sprite=0;
var points=0;
var playing=true;
var count=0;
var mass=10;
var grav=1;
for(var c=0;c<keys.length;c++)keys[c]=false;
//begin 3D engine variables and functions
var dataString="";
var field;
var full=false;
var focalLength=500;
var pi=Math.PI;//pi browser specifically
var cameraX;//01
var cameraY;//23
var cameraZ;//coordinate plane is flipped horizontally out of math class
var losX;
var losY;
var partTwo="";
var d;
var f;
var j=0;
var fighter="-100,-150,100;-100,-120,100;-50,-150,150;-50,-120,150;50,-150,150;50,-120,150;100,-150,100;100,-120,100;-100,-150,-150;-100,-120,-150;100,-150,-150;100,-120,-150@0,1,3,2,0,2,4,5,3,5,7,6,4,6,10,11,7,11,9,8,10,8,0,1,9";
var pixelData;
var planeArr;
var pointArr;
var pointVis;
var surfaceArr;
var surfaceNum;
var planeNum;
var pointNum;
var turn=5;

function point3D(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
}

//p1 is the lesser point, p2 is the greater point
function surface(x,z,y,width,depth,slopex,slopez,id){
    this.active=true;
    this.slopeX=slopex;
    this.slopeZ=slopez;
    this.width=width;
    this.depth=depth;
    this.point=new Array(4);
    this.point = [
        new point3D(x, y, z),
        new point3D(x + width, y + width * slopex, z),
        new point3D(x + width, y + width * slopex + depth * slopez, z + depth),
        new point3D(x, y + depth * slopez, z + depth)
    ];
    this.id=id;
    this.touched=false;
}

function surfaceToPlane(context,a,color,tag){
    a.id=tag;
    var c;
    for(c=0;c<a.point.length;c++){
        pointArr.push(a.point[c]);
        pointVis.push(adjustPoint(pointArr[pointNum]));
        pointNum++;
    }
    planeArr.push(new formList(context,color,tag));
    planeArr[planeNum].addPoint(pointNum-1);
    planeArr[planeNum].addPoint(pointNum-2);
    planeArr[planeNum].addPoint(pointNum-3);
    planeArr[planeNum].addPoint(pointNum-4);
    planeArr[planeNum].addPoint(pointNum-1);
    planeNum++;
}


function adjustPoint(a){
    var adj=new point3D(0,0,0);
    adj.x=a.x-cameraX;
    adj.y=a.y-cameraY;
    adj.z=a.z-cameraZ;
    var radius;
    var angle;
    radius=Math.sqrt(adj.x*adj.x+adj.z*adj.z);//x-axis
    if(adj.z==0)
        adj.z=1;
    angle=Math.atan(adj.x/adj.z)+losX*pi/180;
    if(adj.z<0){
        adj.z=-radius*Math.cos(angle);
        adj.x=-radius*Math.sin(angle);
    }else{
        adj.z=radius*Math.cos(angle);
        adj.x=radius*Math.sin(angle);
    }
    radius=Math.sqrt(adj.y*adj.y+adj.z*adj.z);//y-axis
    if(adj.z==0)
        adj.z=1;
    angle=Math.atan(adj.y/adj.z)+losY*pi/180;
    if(adj.z<0){
        adj.z=-radius*Math.cos(angle);
        adj.y=-radius*Math.sin(angle);
    }else{
        adj.z=radius*Math.cos(angle);
        adj.y=radius*Math.sin(angle);
    }
    if(adj.z==-focalLength)
        adj.z=-focalLength+1;
    if(adj.z<-focalLength){
        ratio=focalLength/(adj.z-focalLength);
        adj.x=Math.round(300+(1/ratio)*adj.x);
        adj.y=Math.round(300+(1/ratio)*adj.y);
    }
    else{
        ratio=focalLength/(adj.z+focalLength);
        adj.x=Math.round(300-ratio*adj.x);
        adj.y=Math.round(300-ratio*adj.y);
    }
    return adj;
}



function surfaceTest(){
    var c;
    var d;
    var f;
    var g;
    var diffx;
    var diffy;
    var diffz;
    var ratio;
    var theta;
    var aboveArr;
    var slopeX;
    var slopeZ;
    wasOnSurface=onSurface;
    onSurface=false;
    for(c=0;c<surfaceArr.length && onSurface==false;c++){
        if(!surfaceArr[c].active)onSurface=false;
        else if(surfaceArr[c].point[0].z<=cameraZ && surfaceArr[c].point[0].z+surfaceArr[c].depth>cameraZ && surfaceArr[c].point[0].x<cameraX && surfaceArr[c].point[0].x+surfaceArr[c].width>cameraX)onSurface=true;
        else onSurface=false;
        if(onSurface){
            surfaceArr[c].touched=true;
            var upper=cameraY-150;
            var lower=cameraY-150+speedy;
            var offsetX=cameraX-surfaceArr[c].point[0].x;
            var offsetZ=cameraZ-surfaceArr[c].point[0].z;
            
            slopeX=surfaceArr[c].slopeX;
            slopeZ=surfaceArr[c].slopeZ;
            var ySet=surfaceArr[c].point[0].y+offsetX*slopeX+offsetZ*slopeZ;
            
            if((upper>=ySet || wasOnSurface) && lower<=ySet){
                onSurface=true;
                transform(planeArr[sprite],0,ySet-cameraY+150,0);
                cameraY=ySet+150;
                forcey+=mass*grav;
                forcex-=mass*grav*Math.cos(Math.atan(slopeX))*Math.sin(Math.atan(slopeX));
                forcez-=mass*grav*Math.cos(Math.atan(slopeZ))*Math.sin(Math.atan(slopeZ));
                forcex+=appForce*Math.sin(losX*pi/180);
                forcez+=appForce*Math.cos(losX*pi/180);
                if(!wasOnSurface){
                    speedy=0;
                }
            }else onSurface=false;
        }
    
    }
    
    return 0;
}

function formList(context,color,tag){
    this.hidden=false;
    this.context=context;
    this.color=color;
    this.tag=tag;
    this.points=new Array(0);
    this.pLength=0;
    this.addPoint=function(a){
        this.points.push(a);
        this.pLength++;
    }
}

function transform(a,x,y,z){
    var c;
    var d;
    var f;
    for(c=0;c<a.pLength;c++){
        f=false;
        for(d=0;d<c && !f;d++)f=(a.points[d]==a.points[c]);
        if(!f){
            pointArr[a.points[c]].x+=x;
            pointArr[a.points[c]].y+=y;
            pointArr[a.points[c]].z+=z;
        }
    }
}

function rotate(a,thx,thy,thz,x,y,z){//th operator is an angle the object is rotated by
var c;
var d;
var f;
var adj=new point3D(0,0,0);
var radius;
var angle;
for(c=0;c<a.pLength;c++){
f=false;
for(d=0;d<c && !f;d++)f=(a.points[d]==a.points[c]);
if(!f){
adj.x=pointArr[a.points[c]].x-x;
adj.y=pointArr[a.points[c]].y-y;
adj.z=pointArr[a.points[c]].z-z;
radius=Math.sqrt(adj.x*adj.x+adj.z*adj.z);//x-axis
if(adj.z==0)adj.z=1;
angle=Math.atan(adj.x/adj.z)+thx*pi/180;
if(adj.z>0){
adj.z=radius*Math.cos(angle);
adj.x=radius*Math.sin(angle);
}else{
adj.z=-radius*Math.cos(angle);
adj.x=-radius*Math.sin(angle);
}
radius=Math.sqrt(adj.y*adj.y+adj.z*adj.z);//y-axis
if(adj.z==0)adj.z=1;
angle=Math.atan(adj.y/adj.z)+thy*pi/180;
if(adj.z<0){
adj.y=-radius*Math.sin(angle);
adj.z=-radius*Math.cos(angle);
}else{
adj.y=radius*Math.sin(angle);
adj.z=radius*Math.cos(angle);
}
radius=Math.sqrt(adj.y*adj.y+adj.x*adj.x);//z-axis
if(adj.y==0)adj.y=1;
angle=Math.atan(adj.x/adj.y)+thz*pi/180;
if(adj.y<0){
adj.y=-radius*Math.cos(angle);
adj.x=-radius*Math.sin(angle);
}else{
adj.y=radius*Math.cos(angle);
adj.x=radius*Math.sin(angle);
}
pointArr[a.points[c]].x=x+adj.x;
pointArr[a.points[c]].y=y+adj.y;
pointArr[a.points[c]].z=z+adj.z;
}
}
}


function transformSurface(a,x,y,z){
a.xa+=x;
a.xb+=x;
a.za+=z;
a.zb+=z;
a.y+=y;
return a;
}

//end 3D engine functions
var osize=0;
var xpos=0;
var ypos=0;
var loc=1;
var chardata;
var otherdata;

function drawSprite(str,color,tag,focus){
planeArr.push(new formList(field,color,tag));
var parts=str.split("@");
var points=parts[0].split(";");
var path=parts[1].split(",");
var c;
var d;
for(c=0;c<points.length;c++){
d=points[c].split(",");
pointArr.push(new point3D(focus.x+parseInt(d[0]),focus.y+parseInt(d[1]),focus.z+parseInt(d[2])));
}
pointNum+=points.length;
for(c=0;c<path.length;c++)planeArr[planeNum].addPoint(pointNum-points.length+parseInt(path[c]));
}

// Generate the configuration screen
// Use a message collection
function startConfig()
{
    playing = true;
    inputpoint = 0;
}
function drawText(ctx, t, dt)
{
    ctx.globalCompositeOperation="source-over";
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(message[inputpoint], width / 2, height / 2);
}
var config = new Screen();
config.on("open", startConfig, config);
config.on("draw", drawText, config);

function chooseKey(e)
{
    var cx = e.keyCode;
    ctrls[inputpoint] = cx;
    inputpoint++;
    if(inputpoint >= message.length) {
        this.close();
        config.close();
        init();
    }
}
var configKeys = new Keyboard();
configKeys.on("keydown", chooseKey, configKeys);

function setup(){
    
    planeArr=new Array(0);
    pointArr=new Array(0);
    pointVis=new Array(0);
    surfaceArr=new Array(0);
    surfaceNum=0;
    planeNum=0;
    pointNum=0;
    
    speedx=0;
    speedy=0;
    speedz=0;
    
    time=0;
    
    cameraX=410;
    cameraY=500;
    cameraZ=400;
    
    losX=0;
    losY=5;
    inputpoint=0;
    if(!field)
        field=document.getElementById("space").getContext("2d");
    config.open(field);
    configKeys.open();
    //other setup actions
}
window.addEventListener("load", setup, false);

function init(){
    document.onkeydown=function(e){
        var cx=(window.event)?event.keyCode:e.keyCode;
        var c=0;
        while(c<ctrls.length && ctrls[c]!=cx)c++;
        if(c<keys.length)keys[c]=true;
    }
    document.onkeyup=function(e){
        var cx=(window.event)?event.keyCode:e.keyCode;
        var c=0;
        while(c<ctrls.length && ctrls[c]!=cx)c++;
        if(c<keys.length)keys[c]=false;
    }
    var d;
    var c;
    
    // This is how th surfaces are configured right now
    for(c=0;c<9;c++){
        surfaceArr.push(new surface(0,c*500,0,500,500,0,0,"xxx"));
        surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
        surfaceNum++;
        
        surfaceArr.push(new surface(5000,c*500,0,500,500,0,0,"xxx"));
        surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
        surfaceNum++;
    }
    for(d=0;d<11;d++){
        surfaceArr.push(new surface(d*500,-500,0,500,500,0,0,"xxx"));
        surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
        surfaceNum++;
        surfaceArr.push(new surface(d*500,c*500,0,500,500,0,0,"xxx"));
        surfaceToPlane(field,surfaceArr[surfaceNum],"#00FF00",surfaceNum);
        surfaceNum++;
    }
    
    drawSprite(fighter,"#FFFFFF","player",new point3D(cameraX,cameraY,cameraZ));
    sprite=planeNum;
    planeNum++;
    recursive3D();
}

function gameOver(a){
playing=false;
}

function recursive3D(){
var accX=0;
var accY=0;
var accZ=0;
field.clearRect(0,0,600,600);
field.font = "14px Times New Roman";   
field.fillStyle = "#FFFFFF";   
field.fillText("speed"+Math.round(Math.sqrt(speedx*speedx+speedy*speedy+speedz*speedz)),400,120);
forcex=0;
forcey=0;
forcez=0;
field.fillText("time:"+(count/20),400,100);
var gx=true;
for(c=0;c<surfaceNum;c++)gx+=surfaceArr[c].touched;
field.fillText("Progress:%"+(gx/surfaceNum)*100,400,140);
if(gx>=surfaceNum)playing=false;
if(cameraY<-1000)playing=false;
if(playing)setTimeout("recursive3D();",50);
else{
  field.font = "40px Times New Roman";   
  field.fillStyle = "#FFFFFF";   
  if(gx>=surfaceNum)field.fillText("COMPLETE!!!", 50, 300);
  else field.fillText("Game Over", 50, 300);
  setTimeout("setup();",8000);
return 0;
}
count++;
if(keys[0]){
appForce=5;
}
if(keys[1]){
appForce=-5;
}
if(!(keys[0] || keys[1]))appForce=0;

if(keys[2])xRotSpeed=-turn;//turn left
if(keys[3])xRotSpeed=turn;//turn right
if(!(keys[2] || keys[3]))xRotSpeed=0;
forcey-=mass*grav;

surfaceTest();//checks for normal force
accX=forcex/mass;
accY=forcey/mass;
accZ=forcez/mass;

cameraX-=speedx+(accX/2);
cameraZ+=speedz+(accZ/2);
cameraY+=speedy+(accY/2);

speedx+=accX;
speedy+=accY;
speedz+=accZ;

transform(planeArr[sprite],-speedx,speedy,speedz);
rotate(planeArr[sprite],-xRotSpeed,0,0,cameraX,cameraY-75,cameraZ);

losX+=xRotSpeed;

var c;
var d;
var i;
var j;
var mod;
var tst;
var tft;
dataString="";
for(c=0;c<pointNum;c++)pointVis[c]=adjustPoint(pointArr[c]);
for(c=0;c<planeNum;c++){
mod=planeArr[c].points.length;
k=false;
spacein=false;
for(var i=0;i<mod && spacein==false;i++)spacein=(pointVis[planeArr[c].points[i]].x>=0 && pointVis[planeArr[c].points[i]].x<=600 && pointVis[planeArr[c].points[i]].y>=0 && pointVis[planeArr[c].points[i]].y<=600 && pointVis[planeArr[c].points[i]].z>0);
if(spacein && !planeArr[c].hidden){
field.strokeStyle=planeArr[c].color;
field.beginPath();
field.moveTo(Math.round(pointVis[planeArr[c].points[0]].x),Math.round(pointVis[planeArr[c].points[0]].y));
for(j=1;j<mod;j++){
field.lineTo(Math.round(pointVis[planeArr[c].points[j]].x),Math.round(pointVis[planeArr[c].points[j]].y));
}
field.stroke();
}}
return 0;
}
