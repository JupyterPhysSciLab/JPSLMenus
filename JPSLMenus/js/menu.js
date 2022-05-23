/* Utilities to generate hierarchical menus in Jupyter from within a
    notebook. These menus will only appear when running the notebook they
    are defined in.
    Jonthan Gutow <gutow@uwosh.edu>
    GIT: https://github.com/JupyterPhysSciLab/JPSLMenus
*/

/*
Initialization (trying to limit namespace collisions)
*/
let JPSLMenus = new Object();

/*
Debugging (set to true to get debug alerts)
*/
JPSLMenus.debug = false;

/*
Menu item template:
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

NOTE ABOUT QUOTATION MARKS: Each line of snippet text should
   be between double quotes (e.g. "). If you want quotes to
   define a string within your snippet use escaped single quotes
   (e.g. \').
*/

// Example of a menu creation function (see the Readme on Github for more
//  information).
JPSLMenus.testMenu = function(){
    var tsturl = {'type': 'url',
                 'title': 'Gutow Homesite',
                 'data': "https://cms.gutow.uwosh.edu/Gutow"};
    var tstaction = {'type':'action',
                'title': 'An action\n (javascript call)',
                'data': "alert(\'This is an alert\')"};
    var tstsnippet = {'type': 'snippet',
                 'title': 'Python Snippet',
                 //Use double quotes around each line of code.
                 'data': ["tststr = \'A string to print\'",
                          "print(tststr)"]};
    var tstcompsnip = {'type': 'computedsnippet',
                 'title': 'Computed Snippet',
                 //Use double quotes around the line of valid javascript.
                 'data': "JPSLMenus.computedsnipexample()"};
    var tstsubmenu = {'type': 'submenu',
                 'title': 'Snippets',
                 'data': [tstsnippet, tstcompsnip]};
    var menu = {'type': 'menu',
                'title': 'Test Menu',
                'data': [tsturl, tstsubmenu, tstaction]};
    JPSLMenus.build(menu);
};


// Example computed snippet code
JPSLMenus.computedsnipexample = function(){
    var snippetstr = '# This is a ';
    var currentcell = Jupyter.notebook.get_selected_cell();
    snippetstr += currentcell.cell_type+' cell.\n# The cell id is ';
    snippetstr += currentcell.cell_id+'.';
    return (snippetstr);
};

JPSLMenus.addsubmenu = function(currelem, submenu){
    if (JPSLMenus.debug){
        alert('Entering addsubmenu().');
    }
    var tempul = document.createElement('ul');
    tempul.classList.add('dropdown-menu');
    for (var i = 0; i<submenu['data'].length; ++i){
        JPSLMenus.addmenuitem(tempul, submenu['data'][i]);
    };
    var templi = document.createElement('li');
    templi.classList.add('dropdown-submenu');
    var tempanchor = document.createElement('a');
    tempanchor.setAttribute('href','#');
    tempanchor.innerHTML = submenu['title'];
    templi.appendChild(tempanchor);
    templi.appendChild(tempul);
    currelem.appendChild(templi);
};

JPSLMenus.addaction = function(currelem, menuaction){
    if (JPSLMenus.debug){
    alert('Entering addaction().');
    }
    var templi = document.createElement('li');
    var tempanchor = document.createElement('a');
    tempanchor.setAttribute('href','#');
    tempanchor.setAttribute('onclick',menuaction['data']);
    tempanchor.innerHTML = menuaction['title'];
    templi.appendChild(tempanchor);
    currelem.appendChild(templi);
};

JPSLMenus.insert_snippet = function(snippet){
    var selectedcell = Jupyter.notebook.get_selected_cell();
    selectedcell.code_mirror.doc.replaceSelection(snippet);
}
JPSLMenus.cleanstr = function(text){
    var newtext=String(text).replaceAll('"','\\"').replaceAll("\'","\\'");
    newtext = newtext.replaceAll('\n','\\n');
    return (newtext);
}
JPSLMenus.addsnippet = function(currelem, menusnippet){
    if (JPSLMenus.debug){
        alert('Entering addsnippet().');
    };
    var templi = document.createElement('li');
    var text = '\'';
    if (JPSLMenus.debug){
        alert(typeof(menusnippet['data']));
    };
    for(var i = 0; i<menusnippet['data'].length; ++i){
            text += JPSLMenus.cleanstr(menusnippet['data'][i])+'\\n';
    };
    var tempanchor = document.createElement('a');
    tempanchor.setAttribute('href','#');
    tempanchor.setAttribute('onclick','JPSLMenus.insert_snippet('
        +text+'\')');
    tempanchor.innerHTML = menusnippet['title'];
    templi.appendChild(tempanchor);
    currelem.appendChild(templi);
};

JPSLMenus.addcomputedsnippet = function(currelem, menusnippet){
    if (JPSLMenus.debug){
    alert('Entering addcomputedsnippet().');
    }
    var templi = document.createElement('li');
    var text = menusnippet['data'];
    var tempanchor = document.createElement('a');
    tempanchor.setAttribute('href','#');
    tempanchor.setAttribute('onclick','JPSLMenus.insert_snippet('
        +text+')');
    tempanchor.innerHTML = menusnippet['title'];
    templi.appendChild(tempanchor);
    currelem.appendChild(templi);
};

JPSLMenus.addurl = function(currelem, menuurl){
    if (JPSLMenus.debug){
    alert('Entering addurl().');
    }
    var templi = document.createElement('li');
    var tempanchor = document.createElement('a');
    tempanchor.setAttribute('target','_blank');
    tempanchor.setAttribute('href',menuurl['data']);
    var icon = document.createElement('i');
    icon.classList.add('fa', 'fa-external-link', 'menu-icon', 'pull-right');
    tempanchor.innerHTML = menuurl['title'];
    tempanchor.appendChild(icon);
    templi.appendChild(tempanchor);
    currelem.appendChild(templi);
};

JPSLMenus.addmenuitem =function(currelem, menuitem){
    if (JPSLMenus.debug){
    alert('Entering addmenuitem().');
    }
    switch (menuitem['type']){
        case 'submenu':
            JPSLMenus.addsubmenu(currelem, menuitem);
            break;
        case 'action':
            JPSLMenus.addaction(currelem, menuitem);
            break;
        case 'snippet':
            JPSLMenus.addsnippet(currelem, menuitem);
            break;
        case 'computedsnippet':
            JPSLMenus.addcomputedsnippet(currelem, menuitem);
            break;
        case 'url':
            JPSLMenus.addurl(currelem, menuitem);
            break;
        default:
            alert('Unrecognized menuitem type in JPSLMenus.addmenuitem()');
            console.log('Unrecognized menuitem type in JPSLMenus.addmenuitem():'
            + menuitem['type']);
    };
};

JPSLMenus.build = function(menu){
    if (menu['type']!='menu'){
        alert('JPSLMenus.build must be passed a dictionary with the type attribute of menu.');
        console.log('JPSLMenus.build was not passed a proper menu dictionary.');
        return;
    };
    JPSLMenus.tempmenu = document.createElement('li');
    JPSLMenus.tempmenu.classList.add("dropdown");
    JPSLMenus.tempmenu.id = menu['title'].replaceAll(' ','_').
        replaceAll('\(','_').replaceAll('\)','_').replaceAll('\[','_').
        replaceAll('\]','_').replaceAll('\:','_');
    var tempelem = document.createElement('a');
    tempelem.classList.add('dropdown-toggle');
    tempelem.setAttribute('href','#');
    tempelem.setAttribute('data-toggle','dropdown');
    tempelem.setAttribute('aria-expanded','false');
    tempelem.innerHTML = menu['title'];
    JPSLMenus.tempmenu.appendChild(tempelem);
    tempelem = document.createElement('ul');
    tempelem.classList.add('dropdown-menu');
    //Iterate through the items
    for (var i = 0; i<menu['data'].length; ++i){
        JPSLMenus.addmenuitem(tempelem, menu['data'][i]);
    };
    JPSLMenus.tempmenu.appendChild(tempelem);
    if (JPSLMenus.debug){
        alert(JPSLMenus.tempmenu.innerHTML);
    };
    var menus = document.getElementById('menus');
    var navmenus = menus.getElementsByClassName('nav navbar-nav')
    navmenus[0].appendChild(JPSLMenus.tempmenu);
};