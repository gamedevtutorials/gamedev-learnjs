// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"ObjectPlugin","status":true,"description":"","parameters":{}},
{"name":"MessageItemInfo","status":true,"description":"Allows to show Item Information in the Message Windows","parameters":{}},
{"name":"EnemyHPByLevel","status":true,"description":"Added dem Gegner zusätzliche HP hinzu, je nachdem wie hoch dieser ist","parameters":{"Actor Id":"5","Factor":"1.3"}},
{"name":"EasyScript","status":true,"description":"","parameters":{}},
{"name":"Newsloader","status":true,"description":"","parameters":{}},
{"name":"ItemScripts","status":true,"description":"v0.9 Allows Scripts to call on Item Use","parameters":{"noteTag":"callscript"}},
{"name":"PartyGainExpPlugin","status":true,"description":"","parameters":{}},
{"name":"HIME_ConditionalChoiceText","status":true,"description":"v1.1 - Allows you to dynamically set the text for each choice\r\nin your events.","parameters":{}},
{"name":"HIME_HiddenChoiceConditions","status":true,"description":"Allows you to hide choices with a simple event call","parameters":{}},
{"name":"GDT_Core","status":true,"description":"","parameters":{}},
{"name":"MBS_MapZoom","status":true,"description":"Makes it possible to zoom in and out the game map\n\n<MBS MapZoom>","parameters":{"Reset on map change":"true","Default zoom":"1.0"}},
{"name":"YEP_StatusMenuCore","status":true,"description":"v1.01a Changes the Status menu for your characters into\na hub that displays more character information.","parameters":{"---Settings---":"","Command Order":"General Parameters Elements ElementsLevel States Attributes Custom Cancel","Command Window Width":"240","Command Window Rows":"4","Command Alignment":"center","---General---":"","General Command":"General","Parameters Text":"Parameters","Experience Text":"Experience","Total Format":"Total %1 for Next %2","EXP Gauge Color 1":"30","EXP Gauge Color 2":"31","---Parameters---":"","Parameters Command":"Parameters","Graph Text":"Parameter Graph","ATK Color":"#ed1c24 #f26c4f","DEF Color":"#f7941d #fdc689","MAT Color":"#605ca8 #bd8cbf","MDF Color":"#448ccb #a6caf4","AGI Color":"#39b54a #82ca9c","LUK Color":"#fff568 #fffac3","---Resist Colors---":"","Above 300%":"10","200% to 300%":"20","150% to 200%":"14","120% to 150%":"6","100% to 120%":"0","80% to 100%":"24","50% to 80%":"29","1% to 50%":"23","Exactly 0%":"31","Below 0%":"27","---Elements---":"","Elements Command":"Elements","Elements Decimal":"2","Element Column 1":"1","Element Column 2":"2 3 4 5 6 7 8 9","Element Column 3":"","Element Column 4":"","---State---":"","States Command":"States","States Decimal":"2","States Column 1":"1 4 5 6","States Column 2":"7 8 9 10","States Column 3":"","States Column 4":"","---Attributes---":"","Attributes Command":"Attributes","Attribute Font Size":"20","Attribute Decimal":"0","Attributes Column 1":"exr hit eva cri cev mev mrf cnt","Attributes Column 2":"mcr tcr pdr mdr fdr grd rec pha","Attributes Column 3":"hrg mrg trg tgr","Attributes Column 4":"","hit Name":"Hit Rate","eva Name":"Evasion Rate","cri Name":"Critical Hit Rate","cev Name":"Critical Evasion Rate","mev Name":"Magic Evasion Rate","mrf Name":"Magic Reflect Rate","cnt Name":"Counter Rate","hrg Name":"HP Regen Rate","mrg Name":"MP Regen Rate","trg Name":"TP Regen Rate","tgr Name":"Aggro Rate","grd Name":"Guard Effect","rec Name":"Recovery Effect","pha Name":"Pharmacology Effect","mcr Name":"MP Cost Rate","tcr Name":"TP Charge Rate","pdr Name":"Physical Damage Rate","mdr Name":"Magical Damage Rate","fdr Name":"Floor Damage Rate","exr Name":"Experience Rate"}},
{"name":"YEP_StatusMenuCore","status":true,"description":"v1.01a Changes the Status menu for your characters into\na hub that displays more character information.","parameters":{"---Settings---":"","Command Order":"General Parameters Elements ElementsLevel States Attributes Custom Cancel","Command Window Width":"240","Command Window Rows":"4","Command Alignment":"center","---General---":"","General Command":"General","Parameters Text":"Parameters","Experience Text":"Experience","Total Format":"Total %1 for Next %2","EXP Gauge Color 1":"30","EXP Gauge Color 2":"31","---Parameters---":"","Parameters Command":"Parameters","Graph Text":"Parameter Graph","ATK Color":"#ed1c24 #f26c4f","DEF Color":"#f7941d #fdc689","MAT Color":"#605ca8 #bd8cbf","MDF Color":"#448ccb #a6caf4","AGI Color":"#39b54a #82ca9c","LUK Color":"#fff568 #fffac3","---Resist Colors---":"","Above 300%":"10","200% to 300%":"20","150% to 200%":"14","120% to 150%":"6","100% to 120%":"0","80% to 100%":"24","50% to 80%":"29","1% to 50%":"23","Exactly 0%":"31","Below 0%":"27","---Elements---":"","Elements Command":"Elements","Elements Decimal":"2","Element Column 1":"1","Element Column 2":"2 3 4 5 6 7 8 9","Element Column 3":"","Element Column 4":"","---State---":"","States Command":"States","States Decimal":"2","States Column 1":"1 4 5 6","States Column 2":"7 8 9 10","States Column 3":"","States Column 4":"","---Attributes---":"","Attributes Command":"Attributes","Attribute Font Size":"20","Attribute Decimal":"0","Attributes Column 1":"exr hit eva cri cev mev mrf cnt","Attributes Column 2":"mcr tcr pdr mdr fdr grd rec pha","Attributes Column 3":"hrg mrg trg tgr","Attributes Column 4":"","hit Name":"Hit Rate","eva Name":"Evasion Rate","cri Name":"Critical Hit Rate","cev Name":"Critical Evasion Rate","mev Name":"Magic Evasion Rate","mrf Name":"Magic Reflect Rate","cnt Name":"Counter Rate","hrg Name":"HP Regen Rate","mrg Name":"MP Regen Rate","trg Name":"TP Regen Rate","tgr Name":"Aggro Rate","grd Name":"Guard Effect","rec Name":"Recovery Effect","pha Name":"Pharmacology Effect","mcr Name":"MP Cost Rate","tcr Name":"TP Charge Rate","pdr Name":"Physical Damage Rate","mdr Name":"Magical Damage Rate","fdr Name":"Floor Damage Rate","exr Name":"Experience Rate"}},
{"name":"GDT_ElementsLeveling","status":true,"description":"v1.4 - Gives your Partymembers the possibility to level their elemental levels.\r\nYou can use notetags to learn skills when an element is leveled up","parameters":{"- General -":"","Level Up Text":"%1s Level for Element %2 is now on %3","Level Curve":"15,40,85,120,160,200,250,300,350,400,500,600,690,830,1000,1200,1500","Extra Damage Curve":"0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,150,150","Element Exp Outside Of Battle":"0","- Status Window (Yanfly Status)-":"","Status Menu Text":"Elements Level","Element Level Column 1":"2 3 4 5 6 7 8","Element Level Column 2":"9 10 11","Show Icons":"1","Icon List":"77,64,65,66,67,68,69,70,71,72,90"}},
{"name":"CodeCracker","status":true,"description":"","parameters":{}},
{"name":"GDT_ElementsLeveling_CustomCurve","status":false,"description":"","parameters":{}},
{"name":"LevelNicknames","status":true,"description":"","parameters":{}},
{"name":"GDT_TimeEvents","status":true,"description":"v1.0 - Timeevents allows you to control Timer on your Events and switch your Self Switches on or off\r\nRequires GDT_Core","parameters":{}}
];
