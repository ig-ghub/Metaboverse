"""License Information
Metaboverse:
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
from __future__ import print_function

"""Import dependencies
"""
import os
import sys

"""Import internal dependencies
"""
from metaboverse.__init__ import __version__
from metaboverse.__init__ import __dependencies__
from metaboverse.arguments import parse_arguments
from metaboverse.arguments import get_dependencies
from metaboverse.network.__main__ import __main__ as curate
from metaboverse.preprocess.__main__ import __main__ as preprocess
from metaboverse.analyze.__main__ import __main__ as analyze

"""Run metaboverse
"""
def main(
        args=None):

    # Read in arguments
    args, args_dict = parse_arguments(
        args,
        __version__)

    # Run metaboverse-curate
    if args_dict['cmd'] == 'curate':

        print('Curating network model...')
        curate(args_dict)

    # Run metaboverse-preprocess
    elif args_dict['cmd'] == 'preprocess':

        print('Preprocessing input data...')
        preprocess(args_dict)

    # Run metaboverse-analyze
    elif args_dict['cmd'] == 'analyze':

        print('Analyzing data in context of network model...')
        analyze(args_dict)

    # Print some error messaging
    else:
        raise Exception('Invalid sub-module selected')

    # Exit
    # Check log file for errors and exceptions
    get_dependencies(args_dict)

"""Run main
"""
if __name__ == '__main__':

    sys.exit(main() or 0)
