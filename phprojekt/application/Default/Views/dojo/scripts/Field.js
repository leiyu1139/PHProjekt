/**
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 2.1 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * @copyright  Copyright (c) 2008 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL 2.1 (See LICENSE file)
 * @version    $Id$
 * @author     Gustavo Solt <solt@mayflower.de>
 * @package    PHProjekt
 * @link       http://www.phprojekt.com
 * @since      File available since Release 6.0
 */

dojo.provide("phpr.Default.Field");

dojo.declare("phpr.Default.Field", phpr.Component, {
    // summary:
    //    class for rendering form fields
    // description:
    //    this class renders the different form types which are available in a PHProjekt Detail View

    checkRender:function(itemlabel, itemid, itemvalue, itemhint) {
        phpr.destroyWidget(itemid);
        var itemchecked = null;
        if (itemvalue == "on") {
            itemchecked = "checked";
        }
        return this.render(["phpr.Default.template", "formcheck.html"], null, {
                            label:    itemlabel,
                            labelfor: itemid,
                            id:       itemid,
                            checked: (itemchecked) ? "checked" : '',
                            tooltip:  this.getTooltip(itemhint)
                });
    },

    textFieldRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formtext.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            type:     'text',
                            disabled: (itemdisabled) ? "disabled" : '',
                            tooltip:   this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    hiddenFieldRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled) {
        phpr.destroyWidget(itemid);
        return this.render(["phpr.Default.template", "formhidden.html"], null, {
                            label:    itemlabel,
                            labelfor: itemid,
                            id:       itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            type:     'hidden',
                            disabled: (itemdisabled) ? "disabled" : ''
                });
    },

    passwordFieldRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formtext.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            type:     'password',
                            disabled: (itemdisabled) ? "disabled" : '',
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    uploadFieldRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, iFramePath, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formupload.html"], null, {
                            label:      itemlabel,
                            labelfor:   (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:         (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:      itemvalue,
                            required:   itemrequired,
                            disabled:   (itemdisabled) ? "disabled" : '',
                            iFramePath: iFramePath,
                            tooltip:    this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    percentageFieldRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        if (!itemvalue || isNaN(itemvalue)) {
            itemvalue = 0;
        }
        var html = this.render(["phpr.Default.template", "formpercentage.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            disabled: (itemdisabled) ? "disabled" : '',
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    textAreaRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formtextarea.html"], null, {
                            label:      itemlabel,
                            labelfor:   (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:         (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:      (itemvalue) ?  itemvalue : '\n\n',
                            required:   itemrequired,
                            disabled:   (itemdisabled) ? "disabled" : '',
                            moduleName: phpr.module,
                            tooltip:    this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    htmlAreaRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var eregHtml = /([\<])([^\>]{1,})*([\>])/i;
        var isHtml   = itemvalue.match(eregHtml);
        var html     = this.render(["phpr.Default.template", "formHtmlTextarea.html"], null, {
                            label:       itemlabel,
                            labelfor:    (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:          (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:       (itemvalue) ?  itemvalue : '\n\n',
                            required:    itemrequired,
                            disabled:    (itemdisabled) ? "disabled" : '',
                            moduleName:  phpr.module,
                            isHtml:      (isHtml) ? true : false,
                            displayHtml: (isHtml) ? 'inline' : 'none',
                            displayText: (isHtml) ? 'none' : 'inline',
                            textModeTxt: phpr.nls.get('To Text Mode'),
                            htmlModeTxt: phpr.nls.get('To HTML Mode'),
                            editHtmlTxt: phpr.nls.get('Edit'),
                            saveTxt:     phpr.nls.get('Save'),
                            tooltip:     this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    dateRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formdate.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            disabled: (itemdisabled) ? "disabled" : '',
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    timeRender:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formtime.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            disabled: (itemdisabled) ? "disabled" : '',
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    selectRender:function(range, itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var options = new Array();
        var j       = 0;
        for (j in range) {
            options.push(range[j]);
            j++;
        }
        var html = this.render(["phpr.Default.template", "formfilterselect.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            value:    itemvalue,
                            required: itemrequired,
                            disabled: (itemdisabled) ? "disabled" : '',
                            values:   options,
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    multipleSelectRender:function(range, itemlabel, itemid, itemvalue, itemrequired, itemdisabled, itemsize,
                                  itemmultiple, itemhint) {
        phpr.destroyWidget(itemid);
        phpr.destroyWidget(itemid + "_disabled");
        var options = new Array();
        var tmp     = itemvalue.split(',');
        for (var j in range) {
            for (var k in tmp) {
                range[j].selected = '';
                if (tmp[k] == range[j].id) {
                    range[j].selected = 'selected';
                    break;
                }
            }
            options.push(range[j]);
            j++;
        }
        var html = this.render(["phpr.Default.template", "formselect.html"], null, {
                            label:    itemlabel,
                            labelfor: (itemdisabled) ? itemid + "_disabled" : itemid,
                            id:       (itemdisabled) ? itemid + "_disabled" : itemid,
                            values:   itemvalue,
                            required: itemrequired,
                            disabled: (itemdisabled) ? "disabled" : '',
                            multiple: itemmultiple,
                            size:     itemsize,
                            options:  options,
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    buttonActionRender:function(itemlabel, itemid, itemtext, icon, action, itemhint) {
        phpr.destroyWidget(itemid);
        var html = this.render(["phpr.Default.template", "formactionbutton.html"], null, {
                            label:    itemlabel,
                            labelfor: itemid,
                            id:       itemid,
                            text:     itemtext,
                            icon:     icon,
                            action:   action,
                            tooltip:  this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, itemrequired, itemdisabled);
    },

    displayFieldRender:function(itemlabel, itemid, itemvalue, itemhint) {
        phpr.destroyWidget(itemid + "_disabled");
        var html = this.render(["phpr.Default.template", "formdisplay.html"], null, {
                            label:   itemlabel,
                            value:   itemvalue,
                            tooltip: this.getTooltip(itemhint)
                });
        return html + this.disabledField(itemlabel, itemid, itemvalue, false, true);
    },

    disabledField:function(itemlabel, itemid, itemvalue, itemrequired, itemdisabled) {
        if (itemdisabled) {
            return this.hiddenFieldRender(itemlabel, itemid, itemvalue, itemrequired, false);
        } else {
            return '';
        }
    },

    getTooltip:function(itemhint) {
        return this.render(["phpr.Default.template", "formTooltip.html"], null, {
                            hint: itemhint
                });
    }
});