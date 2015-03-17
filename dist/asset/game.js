define("common/ui/Title",function(require){function Title(game,options){this.game=game,this.text=options.text,this._init()}var global=require("common/global");return Title.prototype._init=function(){var game=this.game,title=game.add.text(.5*game.width,16,this.text,global.titleStyle);title.anchor.set(.5,0)},Title}),define("common/ui/Dialog",function(require){function Dialog(game,options){this.game=game,this._init(options)}var color=require("common/color"),global=require("common/global");return Dialog.prototype._init=function(options){this._initMask(),this._initBody(options.msg),this._initBtns(options.btns)},Dialog.prototype._initMask=function(){var game=this.game,mask=game.add.image(0,0,"null");mask.scale.set(game.width,game.height),mask.alpha=0,mask.inputEnabled=!0,this.mask=mask},Dialog.prototype._initBody=function(msgText){var game=this.game,height=345,left=.5*game.width,top=.5*-height,body=game.add.image(left,top,"dialog");body.anchor.set(.5),this.body=body;var msg=game.add.text(0,-45,msgText,{font:"bold 24px "+global.chFont,fill:color.get("dark-green"),align:"center"});msg.anchor.set(.5),this.body.addChild(msg)},Dialog.prototype._initBtns=function(btns){var me=this,game=this.game,top=80,fontStyle={font:"bold 28px "+global.chFont,fill:color.get("dark-green"),strokeThickness:5,stroke:color.get("white")};switch(btns.length){case 1:var btnData=btns[0],button=game.add.button(0,top,"dialog-btn",btnData.onClick?btnData.onClick:function(){me.hide()},null,0,0,1);button.anchor.set(.5),me.body.addChild(button);var text=game.add.text(0,top-3,btnData.text,fontStyle);text.anchor.set(.5),me.body.addChild(text);break;case 2:btns.forEach(function(btnData,index){var offset=60,left=-offset+index*offset*2,button=game.add.button(left,top,"dialog-btn-sm",btnData.onClick?btnData.onClick:function(){me.hide()},null,0,0,1);button.anchor.set(.5),me.body.addChild(button);var text=game.add.text(left-2,top+1,btnData.text,fontStyle);text.anchor.set(.5),me.body.addChild(text)})}},Dialog.prototype._destroy=function(){this.mask.destroy(),this.body.destroy()},Dialog.prototype.show=function(){var game=this.game,tweenMask=game.add.tween(this.mask).to({alpha:.7},500,Phaser.Easing.Quadratic.InOut),tweenEntity=game.add.tween(this.body).to({y:"+500"},500,Phaser.Easing.Back.Out);tweenMask.chain(tweenEntity),tweenMask.start()},Dialog.prototype.hide=function(){var me=this,game=this.game,tweenEntity=game.add.tween(this.body).to({y:"-500"},500,Phaser.Easing.Back.In),tweenMask=game.add.tween(this.mask).to({alpha:0},500,Phaser.Easing.Quadratic.InOut);tweenMask.onComplete.add(function(){me._destroy()}),tweenEntity.chain(tweenMask),tweenEntity.start()},Dialog}),define("common/ui/Back",function(){function Back(game,options){this.game=game,this._init(options)}return Back.prototype._init=function(options){var game=this.game;this.element=game.add.button(10,20,"back",function(){options.hasOwnProperty("stateParam")?game.stateTransition.back(options.state,!0,!1,options.stateParam):game.stateTransition.back(options.state)},this,0,0,1)},Back.prototype.getElement=function(){return this.element},Back}),define("select/select",function(require){function initLevels(options){for(var totalCol=options.totalCol,totalRow=options.totalRow,totalPage=options.totalPage,levelSize=84,margin=20,top=100,pageWidth=game.width,left=.5*(pageWidth-totalCol*levelSize-(totalCol-1)*margin),level=1,levelGroup=game.add.group(),unlocked=global.getUnlocked(),onClick=function(){game.stateTransition.forward("level",!0,!1,this.data.level)},page=0;totalPage>page;++page)for(var i=0,y=top;totalRow>i;++i,y+=levelSize+margin)for(var j=0,x=page*pageWidth+left;totalCol>j;++j,x+=levelSize+margin,++level){var button;if(unlocked>=level){button=game.add.button(x,y,"level",onClick,null,1,0,1),levelGroup.add(button);var text=game.add.text(x+.5*button.width,y+.5*button.height,level,{font:"bold 30px "+global.enFont,fill:color.get("bg")});text.anchor.set(.5),levelGroup.add(text);for(var starNum=global.getStar(level),s=0;starNum>s;++s){var star=game.add.image(x+29*s,y+48,"star");star.scale.set(.5)}}else button=game.add.button(x,y,"level-locked"),levelGroup.add(button);button.data={level:level}}return levelGroup}var game,global=require("common/global"),color=require("common/color");return{create:function(){game=this.game,game.add.image(0,0,"bg");var Title=require("common/ui/Title");new Title(game,{text:"选 择 关 卡"});var Back=require("common/ui/Back");new Back(game,{state:"menu"});var totalPage=5,totalCol=4,totalRow=5,levels=initLevels({totalCol:totalCol,totalRow:totalRow,totalPage:totalPage}),Pager=require("./Pager");new Pager(game,{page:Math.floor(global.getUnlocked()/(totalCol*totalRow))+1,totalPage:totalPage,levels:levels,pageWidth:game.width})}}}),define("select/Pager",function(){function Pager(game,options){this.game=game,this.page=options.page?options.page:1,this.totalPage=options.totalPage,this.lastDisabled=!1,this.nextDisabled=!1,this.levels=options.levels,this.pageWidth=options.pageWidth,this.indicators=[],this._initButtons(),this._initIndicators(),this._adjustPage()}return Pager.prototype._initButtons=function(){var game=this.game,width=74,margin=15,top=game.height-120;this.last=game.add.button(game.width/2-width-margin,top,"last",function(){this.back()},this,0,0,1),this.next=game.add.button(game.width/2+margin,top,"next",function(){this.forward()},this,0,0,1),this._updateButtons()},Pager.prototype._initIndicators=function(){for(var game=this.game,size=16,margin=18,left=.5*(game.width-(size+margin)*this.totalPage+margin),top=game.height-175,i=0,x=left;i<this.totalPage;++i,x+=size+margin){var indicator=game.add.image(x,top,i===this.page-1?"dot-current":"dot");this.indicators.push(indicator)}},Pager.prototype._adjustPage=function(){this.levels.x-=this.pageWidth*(this.page-1)},Pager.prototype._translate=function(offset){var game=this.game;"number"==typeof offset&&(offset=(offset>=0?"+":"")+offset);var tween=game.add.tween(this.levels).to({x:offset},500,Phaser.Easing.Sinusoidal.InOut),me=this;tween.onStart.add(function(){me.lastDisabled=!0,me.nextDisabled=!0}),tween.onComplete.add(function(){me.lastDisabled=!1,me.nextDisabled=!1,me._updateIndicators(me.page,0>+offset?++me.page:--me.page),me._updateButtons()}),tween.start()},Pager.prototype.back=function(){this.lastDisabled||this._translate(this.pageWidth)},Pager.prototype.forward=function(){this.nextDisabled||this._translate(-this.pageWidth)},Pager.prototype._updateButtons=function(){this.last,this.next;switch(this.page){case 1:this._disableLast(),this._activateNext();break;case this.totalPage:this._activateLast(),this._disableNext();break;default:this._activateLast(),this._activateNext()}},Pager.prototype._updateIndicators=function(oldPage,newPage){this.indicators[oldPage-1].loadTexture("dot"),this.indicators[newPage-1].loadTexture("dot-current")},Pager.prototype._disableLast=function(){this.last.alpha=.5,this.last.setFrames(0,0,0),this.lastDisabled=!0},Pager.prototype._activateLast=function(){this.last.alpha=1,this.last.setFrames(0,0,1),this.lastDisabled=!1},Pager.prototype._disableNext=function(){this.next.alpha=.5,this.next.setFrames(0,0,0),this.nextDisabled=!0},Pager.prototype._activateNext=function(){this.next.alpha=1,this.next.setFrames(0,0,1),this.nextDisabled=!1},Pager}),define("pay/pay",function(){function initPanels(){var left=20,top=80,panelImage=game.cache.getImage("pay-panel"),panelMargin=10,panelsData=[{coins:200,money:6},{coins:500,money:12},{coins:1200,money:25},{coins:2500,money:50}];panelsData.forEach(function(data,index){var panel=game.add.image(left,top+(panelImage.height+panelMargin)*index,"pay-panel"),panelMidY=panel.y+.5*panel.height,coin=game.add.image(panel.x+60,panelMidY-3,"coin");coin.anchor.set(.5),coin.scale.set(.8);var multip=game.add.text(panel.x+142,panelMidY,"+ "+data.coins,{font:"bold 32px "+global.enFont,fill:color.get("dark-green")});multip.anchor.set(.5);var buy=game.add.button(game.width-124,panelMidY-2,"dialog-btn",function(){},this,0,0,1);buy.anchor.set(.5),buy.scale.set(.6,.75);var money=game.add.text(buy.x+3,panelMidY+3,"￥ "+data.money,{font:"bold 26px "+global.chFont,fill:color.get("dark-green"),strokeThickness:5,stroke:color.get("white")});money.anchor.set(.6)})}function initInfo(){var top=game.height-155,info=game.add.text(.5*game.width,top,"您现在拥有 "+global.getCoins()+" 枚   ",{font:"28px "+global.chFont,fill:color.get("dark-glaze")});info.anchor.set(.5);var coin=game.add.image(info.x+.5*info.width,top-1,"coin");coin.anchor.set(.5),coin.scale.set(.6)}var game,levelNo,global=require("common/global"),color=require("common/color");return{init:function(level){levelNo=level,levelNo=1},create:function(){game=this.game,game.add.image(0,0,"bg");var Title=require("common/ui/Title");new Title(game,{text:"获 取 金 币"});var Back=require("common/ui/Back");new Back(game,{state:"level",stateParam:levelNo}),initPanels(),initInfo()}}}),define("menu/menu",function(require){var color=require("common/color"),global=require("common/global");return{create:function(){var game=this.game;game.add.image(0,0,"bg"),game.add.image((game.width-400)/2,90,"logo");var btnStyle={};btnStyle.width=234,btnStyle.height=80,btnStyle.left=(game.width-btnStyle.width)/2,btnStyle.top=310,btnStyle.marginBottom=20;var textStyle={font:"bold 28px "+global.chFont,fill:color.get("dark-green"),strokeThickness:5,stroke:color.get("white")},btn1=game.add.button(btnStyle.left,btnStyle.top,"menu-btn",function(){game.stateTransition.forward("select")},this,0,0,1),text1=game.add.text(btn1.x+btn1.width/2,btn1.y+btn1.height/2-2,"开 始 游 戏",textStyle);text1.anchor.set(.5);var btn2=game.add.button(btnStyle.left,btnStyle.top+btnStyle.height+btnStyle.marginBottom,"menu-btn",function(){game.stateTransition.forward("level",!0,!1,require("common/global").getUnlocked())},this,0,0,1),text2=game.add.text(btn2.x+btn2.width/2,btn2.y+btn2.height/2-2,"继 续 游 戏",textStyle);text2.anchor.set(.5)}}}),define("level/level",function(require){function checkLevelEvents(){var beforeUnlocked=matrix.isUnlocked();matrix.plusSolved(),matrix.checkStar(function(){starState.show(1)},function(){starState.show(2)},function(){starState.show(3)});var dialog;if(matrix.isSolved())console.log("solved!"),dialog=new Dialog(game,{msg:"太棒了\n\n您已完成所有谜题！",btns:[{text:"下 一 关",onClick:function(){game.stateTransition.forward("level",!0,!1,levelNo+1)}}]}),dialog.show();else if(!beforeUnlocked&&matrix.isUnlocked()){var unlocked=global.getUnlocked();levelNo===unlocked&&(console.log("unlocked!"),global.setUnlocked(unlocked+1),dialog=new Dialog(game,{msg:"您已完成80%\n\n恭喜您成功解锁下一关！",btns:[{text:"知 道 啦"}]}),dialog.show())}}function showWordRender(element,display,word){var text=element.text,hide=game.add.tween(text.scale).to({x:0,y:0},display?500:1,Phaser.Easing.Back.In,!1),show=game.add.tween(text.scale).to({x:1,y:1},500,Phaser.Easing.Back.Out,!1);hide.onComplete.add(function(){setFontLang(text,"ch"),text.setText(word)}),hide.chain(show),hide.start(),checkLevelEvents()}function setFontLang(text,lang){"en"===lang?(text.font=global.enFont,text.fontSize+=2):(text.font=global.chFont,text.fontSize-=2)}function clrRender(grid){grid.getElement().button.loadTexture("grid")}function sltRender(grid){grid.getElement().button.loadTexture("grid-selected"),clueAcross&&clueAcross.destroy(),clueDown&&clueDown.destroy();var clue1=grid.getAcrossClue();clue1&&(clueAcross=createClue("across","横："+clue1));var clue2=grid.getDownClue();clue2&&(clueDown=createClue("down","竖："+clue2)),hint[grid.isActive()?"activate":"disable"]()}function ajtRender(grid){grid.getElement().button.loadTexture("grid-adjacent")}function fetch(){var localData=localStorage.getItem(levelDataKey);localData?initPuzzle(JSON.parse(localData)):require("common/ajax").get({url:require("common/url").GET_LEVEL,data:{index:levelNo},success:function(res){if(res=JSON.parse(res),!res.retcode){var timer=game.time.create();timer.add(300,function(){initPuzzle(preprocessData(res.tableList))}),timer.start()}}})}function preprocessData(data){var orientation,newData=[];for(var key in data)orientation="column"===key?0:1,data[key].forEach(function(item){newData.push({clue:item.question,answer:item.answer,keys:item.shortcut.toUpperCase(),orientation:orientation,startx:+item.x,starty:+item.y})});return localStorage.setItem(levelDataKey,JSON.stringify(newData)),newData}function initPuzzle(data){var x=(game.width-matrixSize*gridSize)/2,y=142;game.add.image(x+3,y+4,"puzzle-shadow");var Matrix=require("./Matrix");matrix=new Matrix({level:levelNo,size:matrixSize,data:data,aGenerator:function(col,row){var onClick=function(){matrix.select(col,row,clrRender,sltRender,ajtRender),matrix.adjustDirection()},left=x+col*gridSize,top=y+row*gridSize,button=game.add.button(left,top,"grid",onClick,null,0,0,1),text=game.add.text(left+gridSize/2,top+gridSize/2+2,"",{fill:color.get("white")});text.fontSize=28,text.fontWeight="bold",text.font=global.enFont,text.anchor.set(.5),text.alpha=.85;var element={button:button,text:text};return element},dGenerator:function(col,row){var element=game.add.image(x+(col+.5)*gridSize,y+(row+.5)*gridSize,"grid-disabled");return element.anchor.set(.5),element.angle=90*Math.floor(4*Math.random()),element}}),matrix.retrive(function(element,display,isSolved){var text=element.text;isSolved&&setFontLang(text,"ch"),text.setText(display)}),initHint()}function initKeyboard(){var y=142+gridSize*matrixSize+10,keySize=49,margin=2,keyLines=[{x:(game.width-8*keySize-7*margin)/2,y:y,keys:["Q","W","E","R","T","Y","O","P"]},{x:(game.width-9*keySize-8*margin)/2,y:y+margin+keySize,keys:["A","S","D","F","G","H","J","K","L"]},{x:(game.width-6*keySize-5*margin)/2,y:y+2*(margin+keySize),keys:["Z","X","C","B","N","M"]}];game.add.image(keyLines[0].x-keySize/2+3,keyLines[0].y+4,"keyboard-shadow");var onClick=function(){var selected=matrix.getSelected();if(selected&&selected.isActive()){var currKey=this.data.key;selected.getElement().text.setText(currKey),selected.test(currKey,showWordRender);var next=matrix.next();next&&matrix.select(next.getX(),next.getY(),clrRender,sltRender,ajtRender),matrix.store()}};keyLines.forEach(function(line){line.keys.forEach(function(key,index){var left=line.x+(keySize+margin)*index,top=line.y,button=game.add.button(left,top,"key",onClick,null,0,0,1);button.data={key:key};var text=game.add.text(left+keySize/2,top+keySize/2+3,key,{font:"bold 26px "+global.enFont,fill:color.get("white"),strokeThickness:4,stroke:color.get("dark-glaze")});text.anchor.set(.5)})}),initRestart()}function initClueBoard(){var x=10,y=60;game.add.image(x+3,y+4,"clue-shadow"),game.add.image(x,y,"clue")}function createClue(type,content){var height=72,ratio=.34,clue=game.add.text(30,48+height*("across"===type?ratio:1-ratio),content,{font:"16px "+global.chFont,fill:color.get("dark-green")});return clue.width>420&&(clue.width=420),clue}function initHint(){var Hint=require("./Hint");hint=new Hint(game,{buttonX:game.width-73.5-10+7,buttonY:142+gridSize*matrixSize+10+103,coinsX:game.width-10-78,coinsY:levelTop-2,matrix:matrix,showWordRender:showWordRender,levelNo:levelNo})}function initStars(){var StarState=require("./StarState");starState=new StarState(game,{starNum:global.getStar(levelNo)})}function initRestart(){var restart=game.add.button(37,142+gridSize*matrixSize+10+102,"key",function(){var dialog=new Dialog(game,{msg:"您确定要重新开始吗？",btns:[{text:"是",onClick:function(){matrix.clear(function(element,isSolved){var text=element.text;text.setText(""),isSolved&&setFontLang(text,"en"),element.button.loadTexture("grid"),dialog.hide()})}},{text:"否"}]});dialog.show()},this,0,0,1),icon=game.add.image(restart.x+.5*restart.width,restart.y+.5*restart.height,"restart");icon.anchor.set(.5)}var game,levelNo,levelDataKey,global=require("common/global"),color=require("common/color"),Dialog=require("common/ui/Dialog"),levelTop=20,matrixSize=10,gridSize=46,matrix=null,hint=null,starState=null,clueAcross=null,clueDown=null;return{init:function(level){levelNo=level,levelDataKey=global.storageKey.levelData+levelNo},create:function(){game=this.game,game.add.image(0,0,"bg");var Title=require("common/ui/Title");new Title(game,{text:"第 "+levelNo+" 关"});var Back=require("common/ui/Back");new Back(game,{state:"select"}),fetch(),initKeyboard(),initClueBoard(),initStars()}}}),define("level/StarState",function(){function StarState(game,options){this.game=game,this.emptyStars=[],this.solidStars=[],this._initComponents(options.starNum)}return StarState.prototype._initComponents=function(starNum){for(var game=this.game,top=38,s=0;3>s;++s){var left=67+38*s,eStar=game.add.image(left,top,"star-empty");eStar.anchor.set(.5);var sStar=game.add.image(left,top,"star-solid");sStar.anchor.set(.5),starNum>s?eStar.scale.set(0):sStar.scale.set(0),this.emptyStars.push(eStar),this.solidStars.push(sStar)}},StarState.prototype.show=function(num){var game=this.game,index=num-1,hide=game.add.tween(this.emptyStars[index].scale).to({x:0,y:0},600,Phaser.Easing.Back.In,!1),show=game.add.tween(this.solidStars[index].scale).to({x:1,y:1},600,Phaser.Easing.Back.Out,!1);hide.chain(show),hide.start()},StarState}),define("level/Matrix",function(){function coord(x,y){return""+x+y}function Grid(options){this.state=options.state,this.element=options.element,"disabled"!==this.state&&(this.word=options.word,this.key=options.key,this.riddles=options.riddles?options.riddles:{across:null,down:null},this.x=options.x,this.y=options.y,this.direction=options.direction,this.display="",this.correct=!!options.correct)}function Riddle(options){this.clue=options.clue,this.answer=options.answer,this.keys=options.keys,this.orientation=options.orientation,this.startx=options.startx,this.starty=options.starty,this.grids=this.grids?this.grids:[],this.size=this.keys.length;var solved=0;this.grids.forEach(function(grid){grid.isSolved()&&++solved}),this.solved=solved}function Matrix(options){this.level=options.level,this.storeKey=global.storageKey.levelState+options.level,this.size=options.size,this.data=options.data,this.grids={},this.riddles=[],this.currents=[],this.selected=null,this.direction="none",this.active=0,this.solved=0,this._init(this.data,options.aGenerator,options.dGenerator)}var global=require("common/global");Grid.prototype.clear=function(render){if(!this.isDisabled()){var isSolved=this.isSolved();this.state="active",this.display="",this.correct=!1,render(this.element,isSolved)}},Grid.prototype.getAttrs=function(){var attrs={state:this.state};return"disabled"!==this.state&&(attrs.display=this.display,attrs.correct=this.correct),attrs},Grid.prototype.setAttrs=function(attrs,render){"disabled"!==this.state&&(this.state=attrs.state,this.display=attrs.display,this.correct=attrs.correct,render(this.element,this.display,this.isSolved()))},Grid.prototype.getElement=function(){return this.element},Grid.prototype.getDirection=function(){return this.direction},Grid.prototype.setDirection=function(direction){this.direction=direction},Grid.prototype.getX=function(){return this.x},Grid.prototype.getY=function(){return this.y},Grid.prototype.setAcrossRiddle=function(riddle){this.riddles.across=riddle},Grid.prototype.setDownRiddle=function(riddle){this.riddles.down=riddle},Grid.prototype.getAcrossClue=function(){var riddle=this.riddles.across;return riddle?riddle.getClue():""},Grid.prototype.getDownClue=function(){var riddle=this.riddles.down;return riddle?riddle.getClue():""},Grid.prototype.getAdjacent=function(){var grids=[],hash={},thisCoord=coord(this.x,this.y),riddles=this.riddles;for(var type in riddles){var riddle=riddles[type];riddles[type]&&riddle.getGrids().forEach(function(grid){var thatCoord=coord(grid.x,grid.y);hash[thatCoord]||thatCoord===thisCoord||(hash[thatCoord]=!0,grids.push(grid))})}return grids},Grid.prototype.isActive=function(){return"active"===this.state},Grid.prototype.isSolved=function(){return"solved"===this.state},Grid.prototype.isDisabled=function(){return"disabled"===this.state},Grid.prototype.check=function(render){var riddles=this.riddles;for(var type in riddles){var riddle=riddles[type];riddle&&riddle.check(render)}},Grid.prototype.plus=function(){var riddles=this.riddles;for(var type in riddles){var riddle=riddles[type];riddle&&riddle.plus()}},Grid.prototype.showWord=function(render){this.isActive()&&(render(this.element,this.display,this.word),this.state="solved",this.display=this.word)},Grid.prototype.setDisplay=function(display){this.display=display},Grid.prototype.getDisplay=function(){return this.display},Grid.prototype.test=function(key,render){this.display=key;var riddles=this.riddles,change=0;for(var type in riddles){var riddle=riddles[type];if(riddle)if(0===change)if(this.correct&&this.key!==key)this.correct=!1,riddle.minus(),change=-1;else{if(this.correct||this.key!==key)break;this.correct=!0,riddle.plus(),change=1}else-1===change?riddle.minus():riddle.plus()}this.check(render)},Riddle.prototype.clear=function(){this.solved=0},Riddle.prototype.getAttrs=function(){return{solved:this.solved}},Riddle.prototype.setAttrs=function(attrs){this.solved=attrs.solved},Riddle.prototype.addGrid=function(grid){this.grids.push(grid)},Riddle.prototype.getGrids=function(){return this.grids},Riddle.prototype.getClue=function(){return this.clue},Riddle.prototype.isSolved=function(){return this.size===this.solved},Riddle.prototype.check=function(render){this.isSolved()&&this.grids.forEach(function(grid){grid.showWord(render)})},Riddle.prototype.plus=function(){++this.solved},Riddle.prototype.minus=function(){--this.solved},Matrix.prototype.set=function(x,y,grid){this.grids[coord(x,y)]=grid},Matrix.prototype.get=function(x,y){var grid=this.grids[coord(x,y)];return"undefined"==typeof grid?null:grid},Matrix.prototype._addCurrents=function(grids,render){grids.forEach(function(grid){render(grid)}),this.currents=this.currents.concat(grids)},Matrix.prototype._clearCurrents=function(render){this.currents.forEach(function(grid){render(grid)}),this.currents=[]},Matrix.prototype.select=function(x,y,clrRender,sltRender,ajtRender){this.selected=this.get(x,y),this._clearCurrents(clrRender),this._addCurrents([this.selected],sltRender),this._addCurrents(this.selected.getAdjacent(),ajtRender)},Matrix.prototype.adjustDirection=function(){switch(this.selected.getDirection()){case"right":this.direction="right";break;case"down":this.direction="down"}},Matrix.prototype.getSelected=function(){return this.selected},Matrix.prototype.unselect=function(){this.selected=null},Matrix.prototype.getActive=function(x,y){var grid=this.get(x,y);return grid&&!grid.isActive()&&(grid=null),grid},Matrix.prototype.right=function(x,y){return this.getActive(x+1,y)},Matrix.prototype.down=function(x,y){return this.getActive(x,y+1)},Matrix.prototype.goRight=function(x,y){var right=this.right(x,y);return right||(right=this.right(x+1,y)),this.direction="right",right},Matrix.prototype.goDown=function(x,y){var down=this.down(x,y);return down||(down=this.down(x,y+1)),this.direction="down",down},Matrix.prototype.next=function(){var curr=this.selected,x=curr.getX(),y=curr.getY();if(!curr)return null;var next=null,right=this.right(x,y),down=this.down(x,y);switch(curr.getDirection()){case"none":this.direction="none";break;case"right":(curr.isSolved()||"down"!==this.direction||down&&down.isActive())&&(next=this.goRight(x,y));break;case"down":(curr.isSolved()||"right"!==this.direction||right&&right.isActive())&&(next=this.goDown(x,y));break;case"both":switch(this.direction){case"none":next=this.goRight(x,y),next||(next=this.goDown(x,y));break;case"right":next=this.goRight(x,y);break;case"down":next=this.goDown(x,y)}}return next},Matrix.prototype._fillPuzzle=function(data,generator){var me=this,direction={0:"right",1:"down"};data.forEach(function(item){for(var riddle=new Riddle({clue:item.clue,answer:item.answer,keys:item.keys,orientation:item.orientation,startx:item.startx,starty:item.starty}),orientation=item.orientation,i=0,len=item.keys.length;len>i;++i){var x=item.startx+(0===orientation?i:0),y=item.starty+(1===orientation?i:0),grid=me.get(x,y);if(grid)switch(0===orientation?grid.setAcrossRiddle(riddle):grid.setDownRiddle(riddle),grid.getDirection()){case"none":len-1>i&&grid.setDirection(direction[orientation]);break;default:len-1>i&&grid.setDirection("both")}else grid=new Grid({state:"active",word:item.answer[i],key:item.keys[i],element:generator(x,y),riddles:{across:0===orientation?riddle:null,down:1===orientation?riddle:null},x:x,y:y,direction:len-1>i?direction[orientation]:"none"}),me.set(x,y,grid),me.active+=1;riddle.addGrid(grid)}me.riddles.push(riddle)})},Matrix.prototype._fillRemainGrids=function(generator){for(var col=0;col<this.size;++col)for(var row=0;row<this.size;++row)this.get(col,row)||this.set(col,row,new Grid({state:"disabled",element:generator(col,row)}))},Matrix.prototype._init=function(data,aGenerator,dGenerator){this._fillPuzzle(data,aGenerator),this._fillRemainGrids(dGenerator)},Matrix.prototype.store=function(){var gridsAttrs={},grids=this.grids;for(var coord in grids){var grid=grids[coord];grid.isDisabled()||(gridsAttrs[coord]=grid.getAttrs())}var riddlesAttrs=[];this.riddles.forEach(function(riddle,index){riddlesAttrs[index]=riddle.getAttrs()});var data={solved:this.solved,grids:gridsAttrs,riddles:riddlesAttrs};localStorage.setItem(this.storeKey,JSON.stringify(data))},Matrix.prototype.retrive=function(render){var me=this,data=JSON.parse(localStorage.getItem(this.storeKey));if(data){this.solved=data.solved;var gridsAttrs=data.grids;for(var coord in gridsAttrs){var attrs=gridsAttrs[coord];this.grids[coord].setAttrs(attrs,render)}data.riddles.forEach(function(attrs,index){me.riddles[index].setAttrs(attrs)})}},Matrix.prototype.clear=function(render){this.currents=[],this.selected=null,this.direction="none",this.solved=0;var grids=this.grids;for(var coord in grids)grids[coord].clear(render);this.riddles.forEach(function(riddle){riddle.clear()}),localStorage.removeItem(this.storeKey)},Matrix.prototype.plusSolved=function(){++this.solved},Matrix.prototype.isSolved=function(){return this.solved===this.active},Matrix.prototype.isUnlocked=function(){return this.solved/this.active>=.8};var starRatio={1:.3,2:.6,3:1};return Matrix.prototype.checkStar=function(render1,render2,render3){var star=global.getStar(this.level),ratio=this.solved/this.active;switch(star){case 2:ratio===starRatio[3]&&(render3(),global.setStar(this.level,3));break;case 1:ratio>=starRatio[2]&&(render2(),global.setStar(this.level,2));break;case 0:ratio>=starRatio[1]&&(render1(),global.setStar(this.level,1))}},Matrix}),define("level/Hint",function(){function Hint(game,options){this.game=game,this.unitCost=20,this._initComponents(options),this.disable()}var global=require("common/global"),color=require("common/color"),Dialog=require("common/ui/Dialog");return Hint.prototype._initComponents=function(options){var game=this.game;this.button=game.add.button(options.buttonX,options.buttonY,"bulb",function(){if(this.active){var coins=global.getCoins()-this.unitCost;if(0>coins){var dialog=new Dialog(game,{msg:"您的金币不足啦",btns:[{text:"回到游戏"}]});return void dialog.show()}var matrix=options.matrix,selected=matrix.getSelected();if(selected&&selected.isActive()){var showWordRender=options.showWordRender;selected.showWord(showWordRender),selected.plus(),selected.check(showWordRender),this.disable(),global.setCoins(coins),this.coinText.setText(coins),matrix.store()}}},this,0,0,1),this.coinCard=game.add.button(options.coinsX,options.coinsY,"coincard",function(){},this,0,0,0),this.coinText=game.add.text(this.coinCard.x+41,this.coinCard.y+.5*this.coinCard.height+2,global.getCoins()+"",{font:"bold 20px "+global.enFont,fill:color.get("dark-green")}),this.coinText.anchor.set(1,.5)},Hint.prototype.disable=function(){this.active=!1,this.button.setFrames(2,2,2)},Hint.prototype.activate=function(){this.active=!0,this.button.setFrames(0,0,1)},Hint}),define("common/weixin",function(){wx.config({debug:!0,appId:"wx06c09a44f6e68fe4",timestamp:""})}),define("common/url",function(){var workSpace="http://www.yiluwan.org/ecomui/xiaoyouxi?controller=";return{GET_LEVEL:workSpace+"game&action=guess",GET_SIGNATURE:workSpace+"ajax&action=gettoken"}}),define("common/stateTransition",function(){function stateTransition(game){this.screenWidth=game.width,this.transition=game.plugins.add(Phaser.Plugin.StateTransition)}return stateTransition.prototype._to=function(properties,state,clearWorld,clearCache,parameter){var transition=this.transition;transition.configure({duration:300,ease:Phaser.Easing.Exponential.In,properties:properties}),transition.to(state,clearWorld,clearCache,parameter)},stateTransition.prototype.forward=function(state,clearWorld,clearCache,parameter){this._to({cameraOffset:{x:.5*-this.screenWidth}},state,clearWorld,clearCache,parameter)},stateTransition.prototype.back=function(state,clearWorld,clearCache,parameter){this._to({cameraOffset:{x:1.5*this.screenWidth}},state,clearWorld,clearCache,parameter)},stateTransition}),define("common/global",function(require){var color=require("common/color"),chFont="Microsoft Yahei",enFont="Arial",storagePrefix="crossword-",storageKey={unlocked:storagePrefix+"unlocked",coins:storagePrefix+"coins",levelData:storagePrefix+"level-data-",levelState:storagePrefix+"level-state-",stars:storagePrefix+"stars"},unlocked=localStorage.getItem(storageKey.unlocked);unlocked=unlocked?+unlocked:1;var stars=localStorage.getItem(storageKey.stars);stars=stars?stars.split(","):[];var coins=localStorage.getItem(storageKey.coins);return coins=coins?+coins:200,{getUnlocked:function(){return unlocked},setUnlocked:function(num){unlocked=num,localStorage.setItem(storageKey.unlocked,unlocked)},getStars:function(){return stars},getStar:function(level){var star=stars[level];return"undefined"==typeof star||""===star?0:star},setStar:function(level,num){stars[level]=num,localStorage.setItem(storageKey.stars,stars.join(","))},getCoins:function(){return coins},setCoins:function(num){coins=num,localStorage.setItem(storageKey.coins,coins)},chFont:chFont,enFont:enFont,titleStyle:{font:"28px "+chFont,fill:color.get("bg"),strokeThickness:5,stroke:color.get("dark-glaze")},storageKey:storageKey}}),define("common/color",function(){var colors={bg:"#f8f7f2",white:"#fff","dark-green":"#283e47",glaze:"#dbd6c4","dark-glaze":"#b2a892"};return{get:function(color){return colors[color]}}}),define("common/ajax",function(){function toQuery(data){var query=[];for(var key in data)data.hasOwnProperty(key)&&query.push(encodeURIComponent(key)+"="+encodeURIComponent(data[key]));return query.join("&")}function post(settings){var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){4===xhr.readyState&&(200===xhr.status?settings.success&&settings.success(xhr.responseText,xhr):settings.failure&&settings.failure(xhr.status,xhr))},xhr.open("POST",settings.url?settings.url:""),xhr.send(this.toQuery(settings.data?settings.data:{}))}function get(settings){var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){4===xhr.readyState&&(200===xhr.status?settings.success&&settings.success(xhr.responseText,xhr):settings.failure&&settings.failure(xhr.status,xhr))};var data=settings.data||{},url=settings.url||"";url+=-1===url.indexOf("?")?"?"+this.toQuery(data):"&"+this.toQuery(data),xhr.open("GET",url),xhr.send()}return{toQuery:toQuery,post:post,get:get}}),define("preload",function(require){return{preload:function(){var game=this.game,loading=game.add.text(.5*game.width,.382*game.height,"载入中...",{font:"34px bold "+require("common/global").chFont,fill:require("common/color").get("dark-glaze")});loading.anchor.set(.5),game.load.image("bg","img/bg.png"),game.load.spritesheet("back","img/back.png",35,38),game.load.image("dialog","img/dialog.png"),game.load.spritesheet("dialog-btn","img/dialog-btn.png",222,80),game.load.spritesheet("dialog-btn-sm","img/dialog-btn-sm.png",83,80),game.load.image("star","img/star.png"),game.load.image("null","img/null.png"),game.load.spritesheet("menu-btn","img/menu-btn.png",234,80),game.load.image("logo","img/logo.png"),game.load.spritesheet("level","img/level.png",84,70),game.load.image("level-locked","img/level-locked.png"),game.load.spritesheet("last","img/last.png",74,72),game.load.spritesheet("next","img/next.png",74,72),game.load.image("dot","img/dot.png"),game.load.image("dot-current","img/dot-current.png"),game.load.spritesheet("grid","img/grid.png",46,46),game.load.spritesheet("grid-selected","img/grid-selected.png",46,46),game.load.spritesheet("grid-adjacent","img/grid-adjacent.png",46,46),game.load.image("grid-disabled","img/grid-disabled.png"),game.load.spritesheet("key","img/key.png",49,49),game.load.image("clue","img/clue.png"),game.load.image("restart","img/restart.png"),game.load.spritesheet("bulb","img/bulb.png",36,50),game.load.spritesheet("coincard","img/coincard.png",83,42),game.load.image("keyboard-shadow","img/keyboard-shadow.png"),game.load.image("puzzle-shadow","img/puzzle-shadow.png"),game.load.image("clue-shadow","img/clue-shadow.png"),game.load.image("star-empty","img/star-empty.png"),game.load.image("star-solid","img/star-solid.png"),game.load.image("pay-panel","img/pay-panel.png"),game.load.image("coin","img/coin.png")
},create:function(){this.state.start("menu")}}}),define("main",function(require){function initWeixin(){var appId="wx06c09a44f6e68fe4",wx=require("dep/jweixin");require("common/ajax").get({url:require("common/url").GET_SIGNATURE,success:function(res){res=JSON.parse(res),res.retcode||(wx.config({debug:!0,appId:appId,timestamp:res.timestamp,nonceStr:"yiluwan",signature:res.token,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo"]}),wx.onMenuShareAppMessage({title:"填字空间",desc:"挑战最强大脑",link:"http://static.yiluwan.org/xiaoyouxi/mobile/xyz_abc/crossword/",imgUrl:"img/icon-512.png"}))}})}function initStates(){var game=new Phaser.Game(480,800,Phaser.AUTO,"");game.state.add("boot",require("boot")),game.state.add("preload",require("preload")),game.state.add("menu",require("menu/menu")),game.state.add("select",require("select/select")),game.state.add("level",require("level/level")),game.state.add("pay",require("pay/pay")),game.state.start("boot")}return{init:function(){initWeixin(),initStates()}}}),define("boot",function(require){return{create:function(){this.game.stage.backgroundColor=require("common/color").get("bg"),this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.scale.pageAlignHorizontally=!0,this.scale.pageAlignVertically=!0;var StateTransition=require("common/stateTransition");this.game.stateTransition=new StateTransition(this.game),this.state.start("preload")}}});