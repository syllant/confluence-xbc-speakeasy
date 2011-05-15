jQuery(document).ready(function()
{
  // Retrieve spaces
  jQuery.ajax({
      url: AJS.Data.get("context-path") + '/rest/prototype/1/space',
      dataType: 'json',
      success : function(spaces)
      {
        var parent = jQuery('ol#breadcrumbs > li:first');
        var menu = jQuery('<ul class="xbc-menu xbc-menu-space"></ul>');
        var currentSpaceName = jQuery('ol#breadcrumbs > li:not(#ellipsis):eq(1) span a').text();

        for (var i = 0, length = spaces.space.length; i < length; i++)
        {
          var space = spaces.space[i];

          addMenuItem(menu, space.key, -1, space.name, space.link[1], true, 'xbc-space');
          if (space.name == currentSpaceName)
          {
            buildBreadcrumbPageMenuItems(space.key, -1, 1);
          }
        }

        menu.appendTo(parent);
        installMenu(parent);
      }
    });

  // Strange behaviour with split bar, which has z-index=10 but stays above is menu z-index=11!?
  jQuery('#splitter > div.vsplitbar').css('z-index', 5);

  function buildBreadcrumbPageMenuItems(spaceKey, parentId, level)
  {
    fetchPages(spaceKey, parentId, function(pages)
    {
      var liEl = jQuery('ol#breadcrumbs > li:not(#ellipsis):eq(' + level + ')');

      var nextLiEl = liEl.nextAll(':not(#ellipsis):first');
      var nextPageName = jQuery('span a', nextLiEl).text();
      var menu = jQuery('<ul class="xbc-menu xbc-menu-page"></ul>');
      for (var i = 0, length = pages.length; i < length; i++)
      {
        var page = pages[i];
        addPageMenuItem(menu, page);

        if (page.text == nextPageName)
        {
          buildBreadcrumbPageMenuItems(spaceKey, page.pageId, level + 1);
        }
      }

      menu.appendTo(liEl);

      installMenu(liEl);
    });
  }

  function addPageMenuItem(menu, page)
  {
    return addMenuItem(menu, null, page.pageId, page.text, page.href, (page.nodeClass == 'closed'),
      (page.linkClass == 'home-node') ? 'xbc-homepage' : 'xbc-page');
  }

  function addMenuItem(menu, spaceKey, pageId, title, href, hasChildren, className)
  {
    jQuery('<li><span class="xbc-title"><span class="xbc-toggle'
      + (hasChildren ? ' xbc-toggle-plus' : '')
      + '"></span><span class="xbc-icon ' + className + '"></span><a href="'
      + href + '">' + title + '</a></span></li>')
      .data('pageId', pageId)
      .data('spaceKey', spaceKey)
      .appendTo(menu);
  }

  function installMenu(parent)
  {
    var menu = jQuery('ul.xbc-menu', parent);

    // Use hoverintent plugin for jquery to manage timeout for out event
    parent.hoverIntent({
        timeout:500,
        over:function()
        {
          menu.show();
          buildSubMenus(menu);

          // Collapse all children menus
          jQuery('ul.xbc-menu', menu).hide();
          jQuery('span.xbc-toggle-minus', menu)
            .removeClass('xbc-toggle-minus')
            .addClass('xbc-toggle-plus');
        },
        out: function()
        {
          menu.hide();
        }
      }
    );
  }

  function buildSubMenus(parentMenu)
  {
    if (parentMenu.hasClass('xbc-menu-built'))
    {
      return;
    }
    parentMenu.addClass('xbc-menu-built');

    jQuery('> li', parentMenu).each(function()
    {
      var liEl = jQuery(this);

      // Handle expand/collapse
      jQuery('span.xbc-toggle', liEl).click(function()
      {
        var childMenu = jQuery('ul.xbc-menu', liEl);
        if (childMenu != null)
        {
          var toggle = jQuery(this);
          if (toggle.hasClass('xbc-toggle-plus'))
          {
            toggle.removeClass('xbc-toggle-plus');
            toggle.addClass('xbc-toggle-minus');
            childMenu.show();
            buildSubMenus(childMenu);
            jQuery('ul.xbc-menu', childMenu).hide();
          }
          else if (toggle.hasClass('xbc-toggle-minus'))
          {
            toggle.removeClass('xbc-toggle-minus');
            toggle.addClass('xbc-toggle-plus');
            childMenu.hide();
          }
        }
      });

      // Build child menu
      if (jQuery('span.xbc-title span.xbc-toggle', this).hasClass('xbc-toggle-plus'))
      {
        fetchPages(liEl.data('spaceKey'), liEl.data('pageId'), function(pages)
        {
          var menu = jQuery('<ul class="xbc-menu xbc-menu-page"></ul>');
          for (var i = 0, length = pages.length; i < length; i++)
          {
            addPageMenuItem(menu, pages[i]);
          }

          menu.appendTo(liEl);
        });
      }
    });
  }

  function fetchPages(spaceKey, parentId, callback)
  {
    var url = (parentId == -1)
      ? '/pages/children.action?node=root&spaceKey=' + encodeURIComponent(spaceKey)
      : '/pages/children.action?pageId=' + parentId;

    jQuery.ajax({
        url: AJS.Data.get("context-path") + url,
        dataType: 'json',
        success : function(pages)
        {
          callback(pages);
        }
      });
  }
});