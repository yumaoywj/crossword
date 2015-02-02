/**
 * @file 启动
 * @author yumao [zhangyu38@baidu.com]
 * @create 2015-01-25
 */

define(function () {
    
    return {
        preload: function () {

        },
        create: function () {
            // 场景设置 #FFDEBE
            this.game.stage.backgroundColor = '#EEE';

            // 比例设置
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // 保持高宽比铺屏
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            // this.scale.setScreenSize(true); // 铺屏

            this.state.start('preload');
        }
    };

});
