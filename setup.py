from setuptools import setup

setup(name='imgView',
      version='0.1',
      description='View Deep ConvNets\' Prediction with zero dependancy',
      keywords = 'Vision Tool',
      author='Jiancheng YANG',
      author_email='jekyLL4168@icloud.com',
      url='https://github.com/duducheng/imgView',
      license="MIT",
      packages = ['imgView','imgView/asset'],
      package_data={'imgView/asset':['*',"data/*","scripts/*","styles/*","views/*"]},
      include_package_data = True,
      long_description='README.md'
)
