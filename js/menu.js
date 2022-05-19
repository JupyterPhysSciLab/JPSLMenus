// Jupyter Notebook Utilities
let JPSLMenus = new Object();
/*
Initialization
*/
/*Define the menu structure
list object with sublists
menu[submenu1, submenu2...[menuitem,...]]
Items have:
title: string that will appear in the menu or as its title
type; 'menu', 'submenu', 'action', 'snippet', 'computedsnippet' or 'url'
data: a list of items to include or the data/code for action ... url.
*/

// Example menu items.
// To use for testing: `JPSLMenus.build(JPSLMenus.menu)`.
// If you want debug alerts set `JPSLMenus.debug = true;` first.

// NOTE ABOUT QUOTATION MARKS: Each line of snippet text should
//   be between double quotes (e.g. "). If you want quotes to
//   define a string within your snippet use escaped single quotes
//   (e.g. \').
JPSLMenus.tsturl = {'type': 'url',
             'title': 'Gutow Homesite',
             'data': "https://cms.gutow.uwosh.edu/Gutow"};
JPSLMenus.tstaction = {'type':'action',
            'title': 'alert',
            'data': "alert(\'This is an alert\')"};
JPSLMenus.tstsnippet = {'type': 'snippet',
             'title': 'Python Snippet',
             'data': ["tststr = \'A string to print\'",
                      "print(teststr)"]};
JPSLMenus.tstcompsnip = {'type': 'computedsnippet',
             'title': 'Computed Snippet',
             'data': "JPSLMenus.computedsnipexample()"};
JPSLMenus.tstsubmenu = {'type': 'submenu',
             'title': 'sub1',
             'data': [JPSLMenus.tstsnippet,JPSLMenus.tstcompsnip]};
JPSLMenus.menu = {'type': 'menu',
            'title': 'Test Menu',
            'data': [JPSLMenus.tsturl, JPSLMenus.tstsubmenu, JPSLMenus
            .tstaction]};

// Example computed snippet code
JPSLMenus.computedsnipexample = function(){
    var snippetstr = '# This is being inserted into the currently selected ';
    snippetstr +='cell, which is number ';
    var currentcell = Jupyter.notebook.get_selected_cell();
    snippetstr += currentcell.input_prompt_number;
    return (snippetstr);
};

JPSLMenus.tempmenu = document.createElement('li');
JPSLMenus.debug = false;

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
        +text+'\')');
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
    tempanchor.setAttribute('href',menuurl['data']);
    tempanchor.innerHTML = menuurl['title'];
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
    JPSLMenus.tempmenu.classList.add("dropdown");
    JPSLMenus.tempmenu.id = menu['title'].replaceAll(/\s\n\.;\(\)\[\]\:/g,'_');
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
    var navmenus = menus. getElementsByClassName('nav navbar-nav')
    navmenus[0].appendChild(JPSLMenus.tempmenu);
};