# JPSLMenus
[Introduction](#introduction) |
[Create Menu with a module](#create-a-menu-on-import-of-a-python-module) |
[Create Menu within a Notebook](#create-a-menu-from-within-a-notebook) |
[Installation](#installation) | [Change Log](#change-log) |
[License](#this-software-is-distributed-under-the-gnu-v3-licensehttpsgnuorglicenses)

## Introduction

This package contains utilities for building hierarchical menus that appear in 
the Jupyter notebook menu bar. Unlike extensions, these menus can be added 
using python import statements, so only appear in notebooks where the
module(s) that creates them are imported.

The expectation is that *JPSLMenus* will be imported into the notebook by 
other modules when they are imported so that each module can use these 
javascript menu creation tools to construct their own menus. It is also 
possible to create a menu on-the-fly from javascript in a code cell 
([see below](#create-a-menu-from-within-a-notebook)).

## Create a menu on import of a python module
(NOTE: below may need modifying to work with a slow connection. Maybe use 
`promise` to wait until the object `JPSLMenus` is defined?)

1. Create a javascript file containing a menu creation function that defines 
   all menu elements, the menu structure and calls `JPSLMenus.build(menu)`:
    * Menu elements are defined by the following template:
   ```
   var item = {'type':'url|action|snippet|computedsnippet|submenu|menu',
                'title':'String that will appear in menu',
                'data': \\depends on type
                   \\ url: "string url"
                   \\ action: "single line of valid javascript"
                   \\ snippet: ["code line 1","code line 2"...]
                   \\ computedsnippet: "single line of valid javascript"
                   \\    that returns a string representation of the 
                   \\    snippet to insert.
                   \\ submenu: [item1, item2...] items can be submenus.
                   \\ menu: [item1, item2...] items can be submenus.
                };
   ```
    * Only one item of type menu should be passed to the build function. It 
     will pull in each item as defined in the data array for the menu.
    * To minimize possible namespace collisions it is suggested that you 
     build your menu creation function as in the following example.
   ```
   let NameOfYourModule = new Object();
   
   NameOfYourModule.createMenu = function(){
       var aurl={'type':'url',
              'title':'Lewis Structure Tutorial',
             'data':'https://cms.gutow.uwosh.edu/Gutow/tutorials/lewis-structure-tutorial'
             };
       var anaction ={'type':'action',
                  'title':'Flag selected cells in pink',
                   'data':"var celllist = Jupyter.notebook.get_selected_cells();for (var i = 0;i<celllist.length;i++){celllist[i].element.children()[0].setAttribute(\"style\",\"background-color:pink;\");}"
                  };
       var asnippet = {'type':'snippet',
                   'title':'Python snippet',
                    //Use double quotes around each line of code.
                   'data':["# A comment","print('Hello World!')"]
                   };
       var acompsnippet = {'type':'computedsnippet',
                   'title':'Computed snippet',
                    //Use double quotes around the line of valid javascript.
                   'data':"'# The time is '+Date()"
                   };
       var asubmenu = {'type':'submenu',
                   'title': 'SubMenu',
                   'data':[aurl, anaction]
                   };
       var menu = {'type':'menu',
               'title':'Test',
               'data':[aurl,anaction, asubmenu, asnippet, acompsnippet]
               };
       JPSLMenus.build(menu);
   }
   ```
     * You can have computed snippets call functions you define. Again, it 
       is recommended that they be isolated from the global namespace by 
       defining them the same way as your `createMenu()` function. The data 
       line for such a snippet would
       read `'data': "NameOfYourModule.NameOfSnippetCreationCode()"`. See 
       the example of the test code embedded in `js\menu.js` within this 
       module.
2. Add code to your module's `__init__.py` file to import the JPSLMenus 
   module and load the javascript for your menu. If your module only 
   creates menus, your init file may not contain anything but the code 
   suggested.
   ```
   import JPSLMenus # This will embed the javascript menu resources in the output
                    #    of the cell in which you import your module.
   ######
   # Install your js files
   ######
   import os
   from IPython.display import display, HTML, Javascript
   
   #Locate package directory
   mydir=os.path.dirname(__file__) #absolute path to directory containing this file.
   
   #load the supporting javascript
   tempJSfile=open(os.path.join(mydir,'js','menu.js'))
   tempscript='<script type="text/javascript">'
   tempscript+=tempJSfile.read()+'</script>'
   tempJSfile.close()
   display(HTML(tempscript))
   del tempJSfile
   del tempscript
   del mydir
   
   # Call your menu creation code
   jstr = 'NameOfYourModule.createMenu();'
   display(Javascript(jstr))
   del display
   del HTML
   del Javascript
   del os
   ```
3. Make sure that `setup.py` or the equivalent for you module includes 
   `JPSLMenus` in its requirements.

## Create a menu from within a notebook

1. In a python code cell issue the command `import JPSLMenus`.
2. In another cell input the javascript to generate your menu. The 
   menu creation function can look just like the one suggested above for a 
   module. However, you have to call it within the same cell to create the 
   menu. Example:
   ```
   %%javascript
   let NameOfYourModule = new Object();
   
   NameOfYourModule.createMenu = function(){
       var aurl={'type':'url',
              'title':'Lewis Structure Tutorial',
             'data':'https://cms.gutow.uwosh.edu/Gutow/tutorials/lewis-structure-tutorial'
             };
       var anaction ={'type':'action',
                  'title':'Flag selected cells in pink',
                   'data':"var celllist = Jupyter.notebook.get_selected_cells();for (var i = 0;i<celllist.length;i++){celllist[i].element.children()[0].setAttribute(\"style\",\"background-color:pink;\");}"
                  };
       var asnippet = {'type':'snippet',
                   'title':'Python snippet',
                    //Use double quotes around each line of code.
                   'data':["# A comment","print('Hello World!')"]
                   };
       var acompsnippet = {'type':'computedsnippet',
                   'title':'Computed snippet',
                    //Use double quotes around the line of valid javascript.
                   'data':"'# The time is '+Date()"
                   };
       var asubmenu = {'type':'submenu',
                   'title': 'SubMenu',
                   'data':[aurl, anaction]
                   };
       var menu = {'type':'menu',
               'title':'Test',
               'data':[aurl,anaction, asubmenu, asnippet, acompsnippet]
               };
       JPSLMenus.build(menu);
   }
   NameOfYourModule.createMenu()
   ```
## Installation

1. This module is best installed in a virtual environment using pip.
2. If not installed, install pipenv:`$ pip3 install --user pipenv`. You may
need to add `~/.local/bin` to your `PATH` to make `pipenv`
available in your command shell. More discussion: 
[The Hitchhiker's Guide to Python](https://docs.python-guide.org/dev/virtualenvs/).
1. Navigate to the directory where this package will be installed.
1. Start a shell in the environment `$ pipenv shell`.
1. Install using pip.
    1. `$ pip install JPSLMenus`. This will install 
       Jupyter into the same virtual
    environment if you do not already have it on your machine. If Jupyter is already
    installed the virtual environment will use the existing installation. This takes
    a long time on a Raspberry Pi. It will not run on a 3B+ without at least 1 GB of
    swap. See: [Build Jupyter on a Pi
   ](https://www.uwosh.edu/facstaff/gutow/computer-and-programming-how-tos/installing-jupyter-on-raspberrian).
    2. Still within the environment shell test this by starting jupyter
`$ jupyter notebook`. Jupyter should launch in your browser.
        1. Open a new notebook using the default (Python 3) kernel.
        1. In the first cell import the JPSLMenus module:
            `import JPSLMenus`.
        1. To try: copy the
              [example menu creation javascript code](#create-a-menu-from-within-a-notebook)
              into a code cell and run it.

## Change Log

* 0.5.0 Working version with basic documentation.
* 0.1.0 first version that is importable.

## [This software is distributed under the GNU V3 license](https://gnu.org/licenses)
This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

Copyright - Jonathan Gutow, 2022. 