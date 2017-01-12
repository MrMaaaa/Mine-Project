/**
 * Created by hasee on 2016/10/5 0005.
 */

$(function() {
    var canvas = $("#myCanvas");
    var cxt = canvas[0].getContext("2d");
    var rightArrow = $("#rightArrow")[0];
    var colorSel = $('#colorOK');
    var ballColor = '#000';
    var randomColor = $('#randomColor');
    var randomSingleColor = $('#randomSingleColor');
    var start = 0,
        end = 0,
        fpsGap = 0;

    $(window).resize(resizeCanvas); //自动铺满屏幕
    function resizeCanvas() {
        canvas.attr('width', $(window)[0].innerWidth);
        canvas.attr('height', $(window)[0].innerHeight);
        canvasWidth = canvas.width();
        canvasHeight = canvas.height();
    }

    resizeCanvas();

    var balls = [];
    var numBalls = 300,
        gravity = 0.5; //一次喷出300个水滴（球），其重力为0.5

    //给每个球赋予同样的坐标，随机的颜色
    for (var ball, i = 0; i < numBalls; i++) {
        ball = new mShape.Circle(0, 0, 2);
        ball.x = canvas[0].width / 2;
        ball.y = canvas[0].height;
        //ball.color = "#" + (Math.random() * 0xffffff).toString(16).replace(".","").slice(0, 6);//随机生成16进制的6位数字模拟随机颜色
        ball.color = ballColor;
        ball.vx = Math.random() * 4 - 2;
        ball.vy = Math.random() * -10 - 20;
        balls.push(ball);
    }

    function drawBall(ball) {
        //开始运动
        ball.vy += gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.context = cxt;

        //判定是否超出边界，如果超出即重置其位置
        if (ball.x - ball.radius > canvas[0].width || ball.x + ball.radius < 0 || ball.y - ball.radius > canvas[0].height || ball.y + ball.radius < 0) {
            ball.x = canvas[0].width / 2;
            ball.y = canvas[0].height;
            ball.vx = Math.random() * 4 - 2;
            ball.vy = Math.random() * -10 - 20;
        }
        ball.draw(1);
    }

    function drawFrame() {
        window.requestAnimationFrame(drawFrame, canvas[0]);
        cxt.clearRect(0, 0, canvas[0].width, canvas[0].height);

        balls.forEach(drawBall);

        end = new Date().getMilliseconds();

        if (fpsGap % 10 === 0 && fpsGap !== 0) {
            $('#fps').text(parseInt(1000 / (end - start)));
            if (fpsGap === 10) {
                fpsGap = 0;
            }
        }
        start = end;
        fpsGap++;
    }

    drawFrame();

    colorSel.click(function() {
        //颜色改变
        ballColor = $('#color').val();
        for (var i = 0; i < numBalls; i++) {
            balls[i].color = ballColor;
        }
    });

    randomColor.click(function() {
        //每个喷泉水珠颜色随机
        for (var i = 0; i < numBalls; i++) {
            balls[i].color = "#" + (Math.random() * 0xffffff).toString(16).replace(".", "").slice(0, 6);
        }
    });

    randomSingleColor.click(function() {
        ballColor = "#" + (Math.random() * 0xffffff).toString(16).replace(".", "").slice(0, 6);
        $('#color').val(ballColor);
        for (var i = 0; i < numBalls; i++) {
            balls[i].color = ballColor;
        }
    });
});
