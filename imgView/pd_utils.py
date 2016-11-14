# coding: utf-8

'''
Some utils for pandas.
Surely, if you want to use it, you should have pandas :)
'''

import os.path
import random
import pandas as pd
from .viewer import imgViewer


def get_json(jsonfile, *args, **kwargs):
    return pd.read_json(jsonfile, *args, **kwargs)


def to_json(df, path, force_ascii=False, *args, **kwargs):
    df.to_json(path, force_ascii=force_ascii,
               orient="records", *args, **kwargs)


def translate(df, trans):
    '''
    translate the classname into the another language
    trans: {src: dest}, take care of the encoding!
    '''
    transfunc = lambda x: trans[x] if x in trans else x
    df = df.rename(columns=transfunc)
    df['classname'] = df['classname'].map(lambda r: transfunc(r))
    return df


class dfViewer(object):
    '''
    Simply view a dataframe given img_dir.
    '''

    def __init__(self, df, img_dir, port=9001, img_port=4169):
        path = "{}.json".format(hash(random.random()))
        to_json(df, path)
        self.__viewer = imgViewer(img_dir, path, img_port)
        os.remove(path)
        self.__viewer.serve(port)

    def clear(self):
        self.__viewer.clear()
