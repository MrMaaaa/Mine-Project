/**
 * Created by hasee on 2016/9/14 0014.
 */

$(document).ready(function() {
	var
		$canvas = $('#myCanvas'), //获取画布DOM元素

		$start = $('#start'), //开始面板
		$startButton = $('#startButton'), //开始按钮
		$introButton = $('#introButton'), //游戏介绍按钮

		$gameIntro = $('#gameIntro'), //游戏介绍面板
		$gameIntro_backButton = $('#gameIntro_backButton'), //游戏介绍返回按钮

		$pause = $('#pause'), //暂停面板
		$restartButton = $('#restartButton'), //暂停面板重新开始菜单

		$gameInfo = $('#gameInfo'), //游戏信息栏
		$score = $('#score'), //分数
		$highScore = $('#highScore'), //最高分

		canvasWidth = $canvas.width(), //获取画布宽度
		canvasHeight = $canvas.height(), //获取画布高度
		cxt = $canvas[0].getContext("2d"),

		start = 0, //起始帧
		end = 0, //结束帧
		fpsGap = 0; //帧数刷新间隔时间

	$(window).resize(resizeCanvas); //自动铺满屏幕
	function resizeCanvas() {
		//$canvas.attr('width', 600);
		$canvas.attr('height', $(window)[0].innerHeight);
		//canvasWidth = $canvas.width();
		canvasHeight = $canvas.height();
		//$score.css('height', canvasHeight / 2 + 'px');
	}

	resizeCanvas();

	//按钮点击事件处理

	//点击开始游戏按钮
	$startButton.click(function() {
		$start.hide();
		$gameInfo.show(); //显示游戏信息
		start = true;
		startGame();
	});

	//点击显示游戏说明
	$introButton.click(function() {
		$gameIntro.show();
	});

	//从游戏说明中返回
	$gameIntro_backButton.click(function() {
		$gameIntro.hide();
	});

	//按esc键弹出暂停菜单
	$(window).keyup(function(e) {
		e.preventDefault();
		var keyCode = e.keyCode;

		//press esc to pause the game
		if (keyCode == 27) {
			start = !start;
			if (start) {
				$pause.hide();
				animate(); //如果继续游戏重新执行该函数
			} else {
				$pause.show();
			}
		}
	});

	$restartButton.click(function() {
		if (!start) {
			$pause.hide();
			init();
			start = !start;
			animate();
		}
	});

	//按钮点击事件处理 end

	var
		i, //循环计数下标
		start = false, //是否开始游戏
		gameEnd = false, //是否游戏结束
		playerAirplane = {
			//玩家飞船属性
			img: $(".airplane1_0")[0],
			x: (canvasWidth - 50) / 2,
			y: canvasHeight - 100,
			sizeX: 50,
			sizeY: 50,
			moveUp: false,
			moveDown: false,
			moveLeft: false,
			moveRight: false,
			shoot: false,
			superFire: false,
			moveSpeed: 4,
			score: 0,
			hp: 100,
			life: 3
		},
		PlayerBullet = function(x, y, radius) {
			this.x = x;
			this.y = y;
			this.color = 'yellow';
			this.radius = radius;
			this.speed = 15;
		},
		playerBullets = [],
		superFireBullets = [],

		//敌人飞船1属性
		EnemyAirplane1 = function(x, y) {
			this.img = $(".enemyAirplane1")[0];
			this.x = x;
			this.y = y;
			this.speedX = 1;
			this.speedY = 5;
			this.size = 25;
			this.type = 1; //飞船类别，用于计分
			this.bulletState = -50; //发射子弹时的位置
		},
		enemyAirPlane1Num = 5, //敌人飞船1个数
		enemyAirplanes = [], //敌人飞船组
		EnemyBullet = function(x, y, radius) {
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speed = 10;
			this.color = 'red';
		},
		enemyBullets = [],

		//背景星球
		Asteroid = function() {
			this.x = random_int(0, canvasWidth);
			this.y = -50;
			this.radius = random_int(5, 15);
			this.speed = random_int(3, 8);
			this.color = "#3ff";
		},
		asteroids = [],
		asteroidNum = 10;

	PlayerBullet.prototype = new Circle(); //绘制玩家子弹函数继承自Circle函数
	EnemyBullet.prototype = new Circle(); //绘制敌人子弹函数继承自Circle函数
	Asteroid.prototype = new Circle(); //绘制背景星球函数继承自Circle函数

	//初始为5个敌人飞船
	for (i = 0; i < enemyAirPlane1Num; i++) {
		enemyAirplanes.push(new EnemyAirplane1(random_int(0, canvasWidth), random_int(-5, -500)));
		enemyBullets.push(new Array());
	}

	//每次出现10个随机大小速度的星球
	for (i = 0; i < asteroidNum; i++) {
		asteroids.push(new Asteroid());
	}

	//初始化
	function init() {
		start = false; //是否开始游戏
		gameEnd = false; //是否游戏结束

		//玩家飞船属性
		playerAirplane = {
			img: $(".airplane1_0")[0],
			x: (canvasWidth - 50) / 2,
			y: canvasHeight - 100,
			sizeX: 50,
			sizeY: 50,
			moveUp: false,
			moveDown: false,
			moveLeft: false,
			moveRight: false,
			shoot: false,
			superFire: false,
			moveSpeed: 4,
			score: 0,
			hp: 100,
			life: 3
		};
		PlayerBullet = function(x, y, radius) {
			this.x = x;
			this.y = y;
			this.color = 'yellow';
			this.radius = radius;
			this.speed = 15;
		};
		playerBullets = [];
		superFireBullets = [];

		//敌人飞船1属性
		EnemyAirplane1 = function(x, y) {
			this.img = $(".enemyAirplane1")[0];
			this.x = x;
			this.y = y;
			this.speedX = 1;
			this.speedY = 5;
			this.size = 25;
			this.type = 1; //飞船类别，用于计分
			this.bulletState = -50; //发射子弹时的位置
		};
		enemyAirPlane1Num = 5; //敌人飞船1个数
		enemyAirplanes = []; //敌人飞船组
		EnemyBullet = function(x, y, radius) {
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.speed = 10;
			this.color = 'red';
		};
		enemyBullets = [];

		//背景星球
		Asteroid = function() {
			this.x = random_int(0, canvasWidth);
			this.y = -50;
			this.radius = random_int(5, 15);
			this.speed = random_int(3, 8);
			this.color = "#3ff";
		};
		asteroids = [];
		asteroidNum = 10;

		PlayerBullet.prototype = new Circle(); //绘制玩家子弹函数继承自Circle函数
		EnemyBullet.prototype = new Circle(); //绘制敌人子弹函数继承自Circle函数
		Asteroid.prototype = new Circle(); //绘制背景星球函数继承自Circle函数

		for (i = 0; i < enemyAirPlane1Num; i++) //初始为5个敌人飞船
		{
			enemyAirplanes.push(new EnemyAirplane1(random_int(0, canvasWidth), random_int(-5, -500)));
			enemyBullets.push(new Array());
		}

		for (i = 0; i < asteroidNum; i++) //每次出现10个随机大小速度的星球
		{
			asteroids.push(new Asteroid());
		}
	}

	//主函数
	function startGame() {
		animate(); //绘制画面
		keyPress(); //按键检测
	}

	//绘制画面
	function animate() {
		//游戏正常运行
		if (start && !gameEnd) {
			start = end;
			$score.html(playerAirplane.score); //更新分数

			cxt.clearRect(0, 0, canvasWidth, canvasHeight); //清空画布

			drawBackground(); //绘制背景，背景在最底层，因此最先绘制

			enemyMove(); //敌人飞船移动
			enemyShoot(); //敌人飞船发射子弹

			playerMove(); //玩家飞船移动（超出画布将不移动）
			cxt.drawImage(playerAirplane.img, playerAirplane.x, playerAirplane.y); //绘制玩家飞船

			if (playerAirplane.shoot) {
				playerShoot(); //玩家发射子弹
			}

			collisionCheck(); //敌人飞船与玩家飞船碰撞检测

			window.requestAnimationFrame(animate);

			//帧数显示
			end = new Date().getMilliseconds();
			if (fpsGap % 10 == 0) {
				$('#fps').text(parseInt(1000 / (end - start)));
				if (fpsGap == 10) {
					fpsGap = 0;
				}
			}
			fpsGap++;

		} else if (gameEnd) {
			//游戏结束
			gameOver();

			//更新最高分
			if (parseInt($score.text()) >= parseInt($highScore.text())) {
				$highScore.text($score.text());
			}

			function restart() {
				$pause.hide();
				init();
				start = true;
				animate();
			}

			//失败后1s重新开始新游戏
			setTimeout(restart, 1000);
		}
	}

	//检测按键
	function keyPress() {
		$(window).keydown(function(e) {
			e.preventDefault();
			var keyCode = e.keyCode;
			if ((keyCode == 37 || keyCode == 65)) //A or leftArrow
			{
				playerAirplane.moveLeft = true;
			}
			if (keyCode == 39 || keyCode == 68) //D or rightArrow
			{
				playerAirplane.moveRight = true;
			}
			if (keyCode == 38 || keyCode == 87) //W or upArrow
			{
				playerAirplane.moveUp = true;
				playerAirplane.img = $(".airplane1_1")[0];
			}
			if (keyCode == 40 || keyCode == 83) //S or downArrow
			{
				playerAirplane.moveDown = true;
			}
		});

		$(window).keyup(function(e) {
			e.preventDefault();
			var keyCode = e.keyCode;

			//A or leftArrow release
			if (keyCode == 37 || keyCode == 65) {
				playerAirplane.moveLeft = false;
			}

			//D or rightArrow release
			if (keyCode == 39 || keyCode == 68) {
				playerAirplane.moveRight = false;
			}

			//W or upArrow release
			if (keyCode == 38 || keyCode == 87) {
				playerAirplane.moveUp = false;
				playerAirplane.img = $(".airplane1_0")[0];
			}

			//S or downArrow release
			if (keyCode == 40 || keyCode == 83) {
				playerAirplane.moveDown = false;
			}

			//space
			if (keyCode == 32) {
				playerAirplane.shoot = true;
				playerAirplane.superFire = false;
				var bx = playerAirplane.x + 25;
				var by = playerAirplane.y - 20;
				var br = 6;
				playerBullets.push(new PlayerBullet(bx, by, br));
			}

			//press f to active super fire mode
			if (keyCode == 70) {
				playerAirplane.superFire = true;
				playerAirplane.shoot = false;
			}
		});
	}

	//玩家飞船移动
	function playerMove() {
		if (playerAirplane.moveLeft) {
			//防止飞船超出画布
			if (playerAirplane.x >= 0) {
				playerAirplane.x -= playerAirplane.moveSpeed;
			}
		}
		if (playerAirplane.moveRight) {
			//防止飞船超出画布
			if (playerAirplane.x + playerAirplane.sizeX <= canvasWidth) {
				playerAirplane.x += playerAirplane.moveSpeed;
			}
		}
		if (playerAirplane.moveUp) {
			//防止飞船超出画布
			if (playerAirplane.y >= 0) {
				playerAirplane.y -= playerAirplane.moveSpeed;
			}
		}
		if (playerAirplane.moveDown) {
			//防止飞船超出画布
			if (playerAirplane.y + playerAirplane.sizeX <= canvasHeight) {
				playerAirplane.y += playerAirplane.moveSpeed;
			}
		}
	}

	//敌人飞船移动
	function enemyMove() {
		for (i = 0; i < enemyAirplanes.length; i++) {
			//自动寻找玩家飞船，如果玩家在敌人上方则停止移动
			if (enemyAirplanes[i].y < playerAirplane.y) {
				if (enemyAirplanes[i].x < playerAirplane.x) {
					enemyAirplanes[i].x += enemyAirplanes[i].speedX;
					//敌人飞船子弹装填
					//当敌人进入画面
					if (enemyAirplanes[i].y >= -50) {
						//控制子弹每隔50距离发射
						if (enemyAirplanes[i].y - enemyAirplanes[i].bulletState >= 50 && enemyAirplanes[i]) {
							enemyBullets[i].push(new EnemyBullet(enemyAirplanes[i].x + 25, enemyAirplanes[i].y + 50, 6));
							enemyAirplanes[i].bulletState = enemyAirplanes[i].y;

							//每发射两发子弹需要间隔150
							if (enemyBullets[i].length % 2 == 0 && enemyBullets[i].length > 0) {
								enemyAirplanes[i].bulletState += 150;
							}
						}
					}
				} else {
					enemyAirplanes[i].x -= enemyAirplanes[i].speedX;
				}
			}
			//敌人飞船一直处于向下移动
			enemyAirplanes[i].y += enemyAirplanes[i].speedY;

			//敌人飞船超出画面则删除该飞船重新生成新飞船
			if (enemyAirplanes[i].y > canvasHeight) {
				enemyAirplanes.splice(i, 1);
				enemyAirplanes.push(new EnemyAirplane1(random_int(0, canvasWidth), random_int(-5, -500)));
			}

			cxt.drawImage(enemyAirplanes[i].img, enemyAirplanes[i].x, enemyAirplanes[i].y); //绘制敌人飞船
		}
	}

	//敌人飞船发射子弹
	function enemyShoot() {
		for (i = 0; i < enemyBullets.length; i++) {
			if (enemyBullets.length > 0) {
				for (var j = 0; j < enemyBullets[i].length; j++) {
					enemyBullets[i][j].Draw(3, cxt);
					enemyBullets[i][j].y += enemyBullets[i][j].speed;
					var xx = enemyBullets[i][j].x - (playerAirplane.x + 25);
					var yy = enemyBullets[i][j].y - (playerAirplane.y + 25);
					var range = enemyBullets[i][j].radius + playerAirplane.sizeX / 2;
					if (xx * xx + yy * yy <= range * range) {
						//如果敌人飞船子弹与玩家飞船重合，即为击中玩家飞船
						gameEnd = true;
					}
				}
			}
		}
	}

	//玩家发射子弹
	function playerShoot() {
		for (var i = 0; i < playerBullets.length; i++) {
			//如果子弹超出画布，删除该子弹
			if (playerBullets[i].y <= -5) {
				playerBullets.splice(i, 1);
			} else {
				playerBullets[i].Draw(3, cxt); //绘制子弹
				playerBullets[i].y -= playerBullets[i].speed; //子弹位移

				//判断子弹是否击中敌人飞船
				for (var j = 0; j < enemyAirplanes.length; j++) {
					var xx = playerBullets[i].x - (enemyAirplanes[j].x + 25);
					var yy = playerBullets[i].y - (enemyAirplanes[j].y + 25);
					var range = playerBullets[i].radius + enemyAirplanes[j].size;

					//如果击中
					if (Math.abs(xx) * Math.abs(xx) + Math.abs(yy) * Math.abs(yy) <= range * range) {
						enemyAirplanes.splice(j, 1); //删除被击中的敌人飞船
						enemyAirplanes.push(new EnemyAirplane1(random_int(0, canvasWidth), random_int(-5, -500))); //生成新的敌人飞船
						enemyBullets.push(new EnemyBullet(enemyAirplanes[i].x + 25, enemyAirplanes[i].y + 50, 6)); //生成对应的敌人飞船子弹
						playerBullets.splice(i, 1); //删除子弹
						playerAirplane.score += enemyAirplanes[i].type * 100; //分数增加
						break; //跳出判定
					}
				}
			}
		}
	}

	//敌人飞船与玩家飞船碰撞检测
	function collisionCheck() {
		for (i = 0; i < enemyAirplanes.length; i++) {
			var xx = Math.abs(enemyAirplanes[i].x + enemyAirplanes[i].size - (playerAirplane.x + playerAirplane.sizeX));
			var yy = Math.abs(enemyAirplanes[i].y + enemyAirplanes[i].size - (playerAirplane.y + playerAirplane.sizeY));
			if (xx * xx + yy * yy <= 40 * 40) {
				gameEnd = true;
			}
		}
	}

	//绘制背景
	function drawBackground() {
		for (i = 0; i < asteroids.length; i++) {
			asteroids[i].Draw(3, cxt);

			asteroids[i].y += asteroids[i].speed;

			//如果背景行星超过画布,删除该行星，插入新行星
			if (asteroids[i].y >= canvasHeight + asteroids[i].radius / 2) {
				asteroids.splice(i, 1);
				asteroids.push(new Asteroid());
			}
		}
	}

	//游戏结束
	function gameOver() {
		cxt.clearRect(0, 0, canvasWidth, canvasHeight); //清空画布
		cxt.font = '50px Courier New';
		cxt.fillStyle = '#fff';
		cxt.fillText('game over', canvasWidth / 2 - 150, canvasHeight / 2);
	}
});
