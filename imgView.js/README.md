# imgView.js for Dev
Use Angular(1.x) and Echarts.

## How to use
Put what you want to view in the "app/data" folder: you need
* a json file

  the json file containing your viewer informations with fields:

  * classname
  * path (related to your img_dir)
  * all the softmax labels and predictions. For example:
```json
  [
      {
          "classname": "guinea_pig",
          "path": "1fc9082329534921bea6efe8c2e0d0fe.jpg",
          "guinea_pig": 0.4752137626,
          "squirrel": 0.0418217174,
          "sikadeer": 0.0412440958,
          "fox": 0.0413286116,
          "dog": 0.1107596825,
          "wolf": 0.0406470456,
          "cat": 0.0414407779,
          "chipmunk": 0.0411178829,
          "giraffe": 0.0417548331,
          "reindeer": 0.0399728514,
          "hyena": 0.0437350264,
          "weasel": 0.0409637392
      }
  ]
```
  Note: You should make sure your json legal.
* some pictures
  You can host the folder, all make the folder accessable from the imgView.js root
* modify the config.js
  * imagePath: pictures' folder path
  * lookAt: your target json file
  * category: all the classname. (sorry, though parsing the json file is possible, but I didn't make it in JavaScript. With Python API I've made it.)

## For dev
```shell
npm install
bower install
```

## gulp tasks:
gulp watch: live dev
gulp: build
gulp deploy: make the dist folder out (you should run gulp build first)
