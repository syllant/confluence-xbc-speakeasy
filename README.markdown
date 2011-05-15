# eXtended Breadcrumb for Confluence
eXtended Breadcrumb for Confluence (XBC) is a plugin for Confluence which enhancces the standard breadcrumb to make navigation easier.

It adds tree menus under each breadcrumb element to navigate quickly towards any other page, including pages belonging to other spaces or pages not available from home page.

## Installation
XBC is a Speakeasy plugin. You have first to install Speakeasy framework, which is itslef provided as a plugin, see [Speakeasy Install Guide](http://confluence.atlassian.com/display/DEVNET/Speakeasy+Install+Guide).

Then, just download [XBC plugin](https://github.com/downloads/syllant/confluence-xbc-speakeasy-1.0.jar) and add it to your own extensions. Speakeasy plugins must be installed from the **Extension** page, available from the user menu. Don't forget to enable plugin.
 
## Usage
Standard breadcrumb behaviour is modified for all pages except administration pages. Just point to an element inside breadcrumb, and you will see a tree menu with all children pages starting with pointed page. Point to the first breadcrumb element (*Dashboard*) and you will be able to browse recursively between all available spaces.