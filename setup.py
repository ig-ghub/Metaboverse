"""
Metabo-verse
A toolkit for navigating and analyzing gene expression datasets
alias: metaboverse
Copyright (C) 2019  Jordan A. Berg
jordan <dot> berg <at> biochem <dot> utah <dot> edu

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
"""

"""Import dependencies
"""
from setuptools import setup
import re
import os

"""Import internal dependencies
"""
from metabalyze.__init__ import __version__
from metabalyze.__init__ import __dependencies__

__path__  =  os.path.dirname(os.path.realpath(__file__)) + '/'

"""Setup arguments"""
setup(
    name = 'Metabo-verse',
    version = __version__,
    description = 'A toolkit for navigating and analyzing biological networks',
    long_description = open('README.md').read(),
    long_description_content_type='text/markdown',
    author = 'Jordan Berg',
    author_email = 'jordan.berg@biochem.utah.edu',
    url = 'https://github.com/j-berg/Metabo-verse',
    packages = ['metaboverse'],
    exclude= ['tests','docs','recipes'],
    package_dir = {'metaboverse': 'metaboverse'},
    license = 'GPL-3.0',
    zip_safe = False,
    install_requires = __dependencies__,
    entry_points={
        "console_scripts": [
            "metaboverse = metaboverse.__main__:main"
            ]
        },
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Bio-Informatics'
        ]
    )
