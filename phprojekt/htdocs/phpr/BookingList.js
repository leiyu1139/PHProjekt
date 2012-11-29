define([
    'dojo/_base/array',
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/date/locale',
    'dojo/html',
    'dojo/json',
    'dojo/store/JsonRest',
    'dojo/date',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/Deferred',
    'phpr/Api',
    'dojo/_base/lang',
    'dojo/Evented',
    //templates
    'dojo/text!phpr/template/bookingList/bookingBlock.html',
    'dojo/text!phpr/template/bookingList/bookingCreator.html',
    'dojo/text!phpr/template/bookingList/dayBlock.html',
    'dojo/text!phpr/template/bookingList.html',
    // only used in templates
    'dijit/form/Select',
    'dijit/form/ValidationTextBox',
    'dijit/form/Textarea',
    'dijit/form/Button',
    'dijit/form/DateTextBox',
    'dijit/form/Form',
    'phpr/DateTextBox'
], function(array, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, locale, html, json, JsonRest,
            date, domConstruct, domClass, Deferred, api, lang, Evented,
            bookingBlockTemplate, bookingCreatorTemplate, dayBlockTemplate, bookingListTemplate) {
    var stripLeadingZero = function(s) {
        if (s.substr(0, 1) === '0') {
            return s.substr(1);
        } else {
            return s;
        }
    };

    var datetimeToJsDate = function(dt) {
        return new Date(
            dt.substr(0, 4),
            stripLeadingZero(dt.substr(5, 2)) - 1,
            stripLeadingZero(dt.substr(8, 2)),
            stripLeadingZero(dt.substr(11, 2)),
            stripLeadingZero(dt.substr(14, 2)),
            stripLeadingZero(dt.substr(17, 2))
        );
    };

    var timeToJsDate = function(t) {
        return new Date(
            0,
            0,
            0,
            stripLeadingZero(t.substr(0, 2)),
            stripLeadingZero(t.substr(3, 2)),
            stripLeadingZero(t.substr(6, 2))
        );
    };

    var projectTitleForId = (function() {
        var titlesById = null;
        var def = new Deferred();

        api.getData(
            '/index.php/Project/Project',
            {query: {projectId: 1, recursive: true}}
        ).then(function(projects) {
            titlesById = {};
            array.forEach(projects, function(p) {
                titlesById[p.id] = p.title;
            });

            def.resolve(titlesById);
            def = null;
        });

        return function(id) {
            if (id == 1) {
                var d = new Deferred();
                d.resolve('Unassigned');
                return d;
            } else if (titlesById === null) {
                return def.then(function(idMap) {
                    return idMap[id];
                });
            } else {
                var d = new Deferred();
                d.resolve(titlesById[id]);
                return d;
            }
        };
    })();

    var BookingBlock = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
        store: null,
        booking: null,

        templateString: bookingBlockTemplate,

        _setBookingAttr: function (booking) {
            projectTitleForId(booking.projectId).then(lang.hitch(this, function(title) {
                html.set(this.project, title);
            }));

            var start = datetimeToJsDate(booking.startDatetime), end = timeToJsDate(booking.endTime);
            end.setDate(start.getDate());
            end.setMonth(start.getMonth());
            end.setFullYear(start.getFullYear());

            var totalMinutes = date.difference(start, end, 'minute'),
                minutes = totalMinutes % 60, hours = Math.floor(totalMinutes / 60);

            html.set(
                this.time,
                locale.format(start, {selector: 'time'}) +
                    ' - ' +
                    locale.format(end, {selector: 'time'}) +
                    ' (' + hours + 'h ' + minutes + 'm)'
            );

            html.set(this.notes, booking.notes);
        },

        _delete: function() {
            this.store.remove(this.booking.id).then(lang.hitch(this, function() {
                this.destroyRecursive();
                this.emit('delete', this.booking);
            }));
        }
    });

    var BookingCreator = declare("phpr.BookingCreator", BookingBlock, {
        templateString: bookingCreatorTemplate,

        buildRendering: function() {
            this.inherited(arguments);

            this.date.set('value', new Date());
            this.own(this.form.on('submit', dojo.hitch(this, this._submit)));

            api.getData(
                '/index.php/Project/Project',
                {query: {projectId: 1, recursive: true}}
            ).then(lang.hitch(this, function(projects) {
                var options = [{value: 1, label: "<span class='projectId'>1</span> Unassigned"}];
                array.forEach(projects, function(p) {
                    options.push({value: p.id, label: "<span class='projectId'>" + p.id + "</span> " + p.title});
                });
                this.project.set("options", options);
            }));
        },

        _getStartRegexp: function() {
            return '(\\d{1,2}[:\\. ]?\\d{2})';
        },

        _getEndRegexp: function() {
            return '(\\d{1,2}[:\\. ]?\\d{2})?';
        },

        _submit: function() {
        }
    });

    var DayBlock = declare([_WidgetBase, _TemplatedMixin], {
        day: new Date(),
        bookings: [],

        // Used when creating new items
        store: null,

        templateString: dayBlockTemplate,

        _setDayAttr: function(day) {
            html.set(this.header, locale.format(day, {selector: 'date', formatLength: 'long'}));
            if (date.compare(new Date(), day, 'date') === 0) {
                domClass.add(this.header, 'today');
            } else {
                domClass.remove(this.header, 'today');
            }
        },

        _setBookingsAttr: function(bookings) {
            array.forEach(bookings, lang.hitch(this, function(b) {
                var widget = new BookingBlock({booking: b, store: this.store});
                widget.placeAt(this.body);
                this.own(widget);
                this.own(widget.on('delete', lang.hitch(this, this._checkEmpty)));
            }));

            this._checkEmpty();
        },

        _checkEmpty: function() {
            if (this.body.children.length === 0) {
                if (date.compare(new Date(), this.day, 'date') === 0) {
                    domClass.add(this.body, 'empty');
                } else {
                    this.destroyRecursive();
                }
            } else {
                domClass.remove(this.body, 'empty');
            }
        }
    });

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        store: new JsonRest({
            target: 'index.php/Timecard/Timecard/'
        }),

        date: new Date(),

        templateString: bookingListTemplate,

        _setStoreAttr: function(store) {
            this._update();
        },

        _setDateAttr: function(date) {
            date.setDate(1);
            html.set(this.selectedDate, locale.format(date, {selector: 'date', formatLength: 'long'}));
            this.date = date;
            this._update();
        },

        _updating: false,

        _update: function() {
            if (this._updating) {
                return;
            }
            this._updating = true;

            this.store.query(
                {filter: this._getQueryString()},
                {sort: [{attribute: 'start_datetime', descending: true}]}
            ).then(lang.hitch(this, function(data) {
                var bookingsByDay = this._partitionBookingsByDay(data);

                domConstruct.empty(this.content);
                if (bookingsByDay.length === 0 || date.compare(new Date(), bookingsByDay[0].day, 'date') !== 0) {
                    this._addDayBlock({day: new Date(), bookings: []});
                }

                array.forEach(bookingsByDay, this._addDayBlock, this);
                this._updating = false;
            }));
        },

        _addDayBlock: function(params) {
            params.store = this.store;
            var widget = new DayBlock(params);
            widget.placeAt(this.content);
            this.own(widget);
        },

        _getQueryString: function() {
            var monthStart = this.date || new Date();
            monthStart = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);

            return json.stringify({
                startDatetime: {
                    '!ge': monthStart.toString(),
                    '!lt': date.add(monthStart, 'month', 1).toString()
                }
            });
        },

        _partitionBookingsByDay: function(bookings) {
            var partitions = {};
            array.forEach(bookings, function(b) {
                var start = datetimeToJsDate(b.startDatetime),
                    day = new Date(
                    start.getFullYear(),
                    start.getMonth(),
                    start.getDate()
                );
                partitions[day] = partitions[day] || [];
                partitions[day].push(b);
            });

            var ret = [];
            for (var day in partitions) {
                ret.push({
                    day: new Date(day),
                    bookings: partitions[day]
                });
            }

            return ret;
        }
    });
});
