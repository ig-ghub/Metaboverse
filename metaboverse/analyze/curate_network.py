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
import pandas as pd
import pickle

"""Import internal dependencies
"""

"""Set globals
"""

"""Tests
"""
def tests():

    network = read_network('/Users/jordan/Desktop/reactome_test/HSA_metaboverse_db.pickle')
    network.keys()

    network['chebi_reference']['R-ALL-9014945']

"""Read in networkx-formatted pickle file from curation step
"""
def read_network(
        file):

    with open(file, 'rb') as network_file:
        network = pickle.load(network_file)

    return network

"""Build custom metabolic model for use in analyses
"""
def __main__(
        model):

    # Read in network file
    network = read_network(
        file=model)

    return network
