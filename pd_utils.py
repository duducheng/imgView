# coding: utf-8

'''
Some utils for pandas.
Surely, if you want to use it, you should have pandas :)
'''

import os.path
import random
import pandas as pd
from .viewer import imgViewer, data_folder


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

    def __init__(self, df, img_dir):
        path = os.path.join(data_folder,
                                "{}.json".format(hash(random.random())))
        to_json(df, path)
        self.__access = os.path.split(path)[-1]
        self.__viewer = imgViewer(img_dir, self.__access)
        self.__viewer.serve()

    def clear(self):
        self.__viewer.kill()
        self.__viewer.remove(self.__access)
