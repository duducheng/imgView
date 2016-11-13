# coding: utf-8
# Note: it's tested in Python 2.*

import os
import shutil
import subprocess
import json
import random
import time

ASSET = "dist/"
DATA = "data/"
CONFIG_FILE = "config.js"

ROOT = os.path.dirname(os.path.abspath(__file__))


class imgViewer(object):

    def __init__(self, img_dir, jsonfile, img_port=4168):
        '''
        Set up object and write <CONFIG_FILE>.
        img_dir: the path of where you images are
        jsonfile: path or file.
            if it's file, you should used the files before so that it has been in the cache data folder.
            the json file containing your viewer informations with fields:
            classname, path (related to your img_dir), and all the softmax labels and predictions.
        an example fields:
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
        Note: You should make sure your json legal.
        '''

        self.__img_dir = img_dir
        self.__img_port = img_port
        self.__cwd = os.getcwd()
        self.__cleared = False
        self.__asset = os.path.join(self.__cwd,
                                    ".cache{}".format(hash(random.random())))
        shutil.copytree(os.path.join(ROOT, ASSET), self.__asset)
        print "Created cache at {}".format(self.__asset)

        if not jsonfile.endswith(".json"):
            raise ValueError(
                "'jsonfile' must be a filename ending with '.json': %s" % jsonfile)
        if not os.path.exists(img_dir):
            raise ValueError("Can't find image root: %s" % img_dir)
        if not os.path.exists(jsonfile):
            jsonfile = os.path.join(
                self.__asset, DATA, os.path.split(jsonfile)[-1])
            if not os.path.exists(jsonfile):
                raise ValueError("Can't find json: %s" % jsonfile)
        else:
            shutil.copy2(jsonfile, os.path.join(self.__asset, DATA))
        with open(jsonfile) as f:
            json_content = json.load(f)
            category = set(json_content[0].keys()).difference(
                {'classname', 'path'})
        with open(os.path.join(self.__asset, DATA, CONFIG_FILE), "w") as f:
            f.write(config4writing(
                img_port, os.path.split(jsonfile)[-1], category))

    def serve(self, port=9000):
        if self.__cleared:
            raise ValueError("Cleared")
        start_simple_server = "python -m SimpleHTTPServer {0:d}"
        os.chdir(self.__img_dir)
        self.__img_p = subprocess.Popen(
            start_simple_server.format(self.__img_port))
        os.chdir(os.path.join(self.__asset))
        self.__p = subprocess.Popen(start_simple_server.format(port))
        os.chdir(self.__cwd)
        print('Find app running on http://localhost:%s/' % port)

    def clear(self, stupid_wait=0.3):
        if self.__cleared:
            print "Cleared."
            return
        self.__img_p.kill()
        self.__p.kill()
        time.sleep(stupid_wait)
        shutil.rmtree(self.__asset)
        self.__cleared = True


def config4writing(img_port, jsonfile, category):
    CONFIG = '''var CONFIG = {
    imagePath: %s,
    lookAt: %s,
    category: %s
}
    '''
    ret = CONFIG % (
        "'http://localhost:{}/'".format(img_port),
        "'{}'".format(jsonfile),
        list2str(category)
    )
    return ret


def list2str(lst):
    ret = u"','".join(map(unicode, lst))
    return (u"['" + ret + u"']").encode('utf-8')
