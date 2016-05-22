/**
 * Created by Gilles on 05.05.2016.
 */
module.exports = function (grunt) {

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      "Core": {
        "src": ["src/plugins/Core/Core.js","src/plugins/Core/*.js"],
        "dest": "js/plugins/Core.js"
      },
      "EasyScript": {
        "src": "src/plugins/Easyscript/*.js",
        "dest": "js/plugins/EasyScript.js"
      },
      "NewsLoader": {
        "src": "src/plugins/Newsloader/*.js",
        "dest": "js/plugins/Newsloader.js"
      },
      "Item": {
        "src": "src/plugins/Items/*.js",
        "dest": "js/plugins/GDTItems.js"
      },
      "MainScripts": {"files":{"js/rpg_core.js":["src/main/rpg_core/JsExtensions.js","src/main/rpg_core/Utils.js","src/main/rpg_core/Point.js","src/main/rpg_core/Rectangle.js","src/main/rpg_core/Bitmap.js","src/main/rpg_core/Graphics.js","src/main/rpg_core/Input.js","src/main/rpg_core/TouchInput.js","src/main/rpg_core/Sprite.js","src/main/rpg_core/Tilemap.js","src/main/rpg_core/TilingSprite.js","src/main/rpg_core/ScreenSprite.js","src/main/rpg_core/Window.js","src/main/rpg_core/WindowLayer.js","src/main/rpg_core/Weather.js","src/main/rpg_core/ToneFilter.js","src/main/rpg_core/ToneSprite.js","src/main/rpg_core/Stage.js","src/main/rpg_core/WebAudio.js","src/main/rpg_core/Html5Audio.js","src/main/rpg_core/JsonEx.js"],"js/rpg_managers.js":["src/main/rpg_managers/DataManager.js","src/main/rpg_managers/ConfigManager.js","src/main/rpg_managers/StorageManager.js","src/main/rpg_managers/ImageManager.js","src/main/rpg_managers/AudioManager.js","src/main/rpg_managers/SoundManager.js","src/main/rpg_managers/TextManager.js","src/main/rpg_managers/SceneManager.js","src/main/rpg_managers/BattleManager.js","src/main/rpg_managers/PluginManager.js"],"js/rpg_objects.js":["src/main/rpg_objects/Game_Temp.js","src/main/rpg_objects/Game_System.js","src/main/rpg_objects/Game_Timer.js","src/main/rpg_objects/Game_Message.js","src/main/rpg_objects/Game_Switches.js","src/main/rpg_objects/Game_Variables.js","src/main/rpg_objects/Game_SelfSwitches.js","src/main/rpg_objects/Game_Screen.js","src/main/rpg_objects/Game_Picture.js","src/main/rpg_objects/Game_Item.js","src/main/rpg_objects/Game_Action.js","src/main/rpg_objects/Game_ActionResult.js","src/main/rpg_objects/Game_BattlerBase.js","src/main/rpg_objects/Game_Battler.js","src/main/rpg_objects/Game_Actor.js","src/main/rpg_objects/Game_Enemy.js","src/main/rpg_objects/Game_Actors.js","src/main/rpg_objects/Game_Unit.js","src/main/rpg_objects/Game_Party.js","src/main/rpg_objects/Game_Troop.js","src/main/rpg_objects/Game_Map.js","src/main/rpg_objects/Game_CommonEvent.js","src/main/rpg_objects/Game_CharacterBase.js","src/main/rpg_objects/Game_Character.js","src/main/rpg_objects/Game_Player.js","src/main/rpg_objects/Game_Follower.js","src/main/rpg_objects/Game_Followers.js","src/main/rpg_objects/Game_Vehicle.js","src/main/rpg_objects/Game_Event.js","src/main/rpg_objects/Game_Interpreter.js"],"js/rpg_scenes.js":["src/main/rpg_scenes/Scene_Base.js","src/main/rpg_scenes/Scene_Boot.js","src/main/rpg_scenes/Scene_Title.js","src/main/rpg_scenes/Scene_Map.js","src/main/rpg_scenes/Scene_MenuBase.js","src/main/rpg_scenes/Scene_Menu.js","src/main/rpg_scenes/Scene_ItemBase.js","src/main/rpg_scenes/Scene_Item.js","src/main/rpg_scenes/Scene_Skill.js","src/main/rpg_scenes/Scene_Equip.js","src/main/rpg_scenes/Scene_Status.js","src/main/rpg_scenes/Scene_Options.js","src/main/rpg_scenes/Scene_File.js","src/main/rpg_scenes/Scene_Save.js","src/main/rpg_scenes/Scene_Load.js","src/main/rpg_scenes/Scene_GameEnd.js","src/main/rpg_scenes/Scene_Shop.js","src/main/rpg_scenes/Scene_Name.js","src/main/rpg_scenes/Scene_Debug.js","src/main/rpg_scenes/Scene_Battle.js","src/main/rpg_scenes/Scene_Gameover.js"],"js/rpg_sprites.js":["src/main/rpg_sprites/Sprite_Base.js","src/main/rpg_sprites/Sprite_Button.js","src/main/rpg_sprites/Sprite_Character.js","src/main/rpg_sprites/Sprite_Battler.js","src/main/rpg_sprites/Sprite_Actor.js","src/main/rpg_sprites/Sprite_Enemy.js","src/main/rpg_sprites/Sprite_Animation.js","src/main/rpg_sprites/Sprite_Damage.js","src/main/rpg_sprites/Sprite_StateIcon.js","src/main/rpg_sprites/Sprite_StateOverlay.js","src/main/rpg_sprites/Sprite_Weapon.js","src/main/rpg_sprites/Sprite_Balloon.js","src/main/rpg_sprites/Sprite_Picture.js","src/main/rpg_sprites/Sprite_Timer.js","src/main/rpg_sprites/Sprite_Destination.js","src/main/rpg_sprites/Spriteset_Base.js","src/main/rpg_sprites/Spriteset_Map.js","src/main/rpg_sprites/Spriteset_Battle.js"],"js/rpg_windows.js":["src/main/rpg_windows/Window_Base.js","src/main/rpg_windows/Window_Selectable.js","src/main/rpg_windows/Window_Command.js","src/main/rpg_windows/Window_HorzCommand.js","src/main/rpg_windows/Window_Help.js","src/main/rpg_windows/Window_Gold.js","src/main/rpg_windows/Window_MenuCommand.js","src/main/rpg_windows/Window_MenuStatus.js","src/main/rpg_windows/Window_MenuActor.js","src/main/rpg_windows/Window_ItemCategory.js","src/main/rpg_windows/Window_ItemList.js","src/main/rpg_windows/Window_SkillType.js","src/main/rpg_windows/Window_SkillStatus.js","src/main/rpg_windows/Window_SkillList.js","src/main/rpg_windows/Window_EquipStatus.js","src/main/rpg_windows/Window_EquipCommand.js","src/main/rpg_windows/Window_EquipSlot.js","src/main/rpg_windows/Window_EquipItem.js","src/main/rpg_windows/Window_Status.js","src/main/rpg_windows/Window_Options.js","src/main/rpg_windows/Window_SavefileList.js","src/main/rpg_windows/Window_ShopCommand.js","src/main/rpg_windows/Window_ShopBuy.js","src/main/rpg_windows/Window_ShopSell.js","src/main/rpg_windows/Window_ShopNumber.js","src/main/rpg_windows/Window_ShopStatus.js","src/main/rpg_windows/Window_NameEdit.js","src/main/rpg_windows/Window_NameInput.js","src/main/rpg_windows/Window_ChoiceList.js","src/main/rpg_windows/Window_NumberInput.js","src/main/rpg_windows/Window_EventItem.js","src/main/rpg_windows/Window_Message.js","src/main/rpg_windows/Window_ScrollText.js","src/main/rpg_windows/Window_MapName.js","src/main/rpg_windows/Window_BattleLog.js","src/main/rpg_windows/Window_PartyCommand.js","src/main/rpg_windows/Window_ActorCommand.js","src/main/rpg_windows/Window_BattleStatus.js","src/main/rpg_windows/Window_BattleActor.js","src/main/rpg_windows/Window_BattleEnemy.js","src/main/rpg_windows/Window_BattleSkill.js","src/main/rpg_windows/Window_BattleItem.js","src/main/rpg_windows/Window_TitleCommand.js","src/main/rpg_windows/Window_GameEnd.js","src/main/rpg_windows/Window_DebugRange.js","src/main/rpg_windows/Window_DebugEdit.js"]}}
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base: '.',
          open: true,
          keepalive: true
        }
      }
    },
    uglify: {
      mainFiles: {
        src: "src/*.js",
        "dest": "js/",
        "expand": true,
        "flatten": true
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: ['src/*.js'],
            dest: 'js/',
            filter: "isFile",
            flatten: true
          }
        ]
      },
      build: {
        files: [

          {
            expand: true,
            src: ['**'],
            dest: 'build/',
            flatten: false,
            filterFileExceptions: [".idea", ".gitignore", "node_modules", "Gruntfile.js", "package.json", "src", "README.md"],
            filter: function (filepath) {
              var allowed = true;
              var exceptions = this.filterFileExceptions || [];
              for (var i = 0; i < exceptions.length; i++) {
                if (filepath.replace("\\", "/").indexOf(exceptions[i].replace("\\", "/")) == 0) {
                  allowed = false;
                  break;
                }
              }
              return allowed;
            }
          }

        ]
      }
    },
    watch: {

      plugins: {
        files: 'src/plugins/**/*.js',
        tasks: ['dev-buildPlugins']
      },
      options: {
        debounceDelay: 3000,
        atBegin: true
      }
    },
    clean: {
      build: ['build']
    }

  });

  grunt.registerTask("dev-restoreMainFiles", ["copy:main"]);
  grunt.registerTask("dev-buildPlugins", ["concat"]);
  grunt.registerTask("dev-watchTask", ["watch:plugins"]);
  grunt.registerTask("prod-build", ["concat", "uglify"]);
  grunt.registerTask("html-server", ["connect:server"]);
  grunt.registerTask("prod-build", ["clean:build", "copy:build"]);


};