import React, { Component, PropTypes } from "react";

import cx from "classnames";
import _ from "underscore";

const SHORTCUTS = [
    { name: "Hoje",        operator: ["=", "<", ">"], values: [["relative_datetime", "current"]]},
    { name: "Ontem",    operator: ["=", "<", ">"], values: [["relative_datetime", -1, "day"]]},
    { name: "Passados 7 dias",  operator: "TIME_INTERVAL", values: [-7, "day"]},
    { name: "Passados 30 dias", operator: "TIME_INTERVAL", values: [-30, "day"]}
];

const RELATIVE_SHORTCUTS = {
    "Última(o)": [
        { name: "Semana",  operator: "TIME_INTERVAL", values: ["last", "week"]},
        { name: "Mês", operator: "TIME_INTERVAL", values: ["last", "month"]},
        { name: "Ano",  operator: "TIME_INTERVAL", values: ["last", "year"]}
    ],
    "Esta(e)": [
        { name: "Semana",  operator: "TIME_INTERVAL", values: ["current", "week"]},
        { name: "Mês", operator: "TIME_INTERVAL", values: ["current", "month"]},
        { name: "Ano",  operator: "TIME_INTERVAL", values: ["current", "year"]}
    ]
};

export default class RelativeDatePicker extends Component {
    constructor(props, context) {
        super(props, context);

        _.bindAll(this, "isSelectedShortcut", "onSetShortcut");
    }

    static propTypes = {
        filter: PropTypes.array.isRequired,
        onFilterChange: PropTypes.func.isRequired
    };

    isSelectedShortcut(shortcut) {
        let { filter } = this.props;
        return (
            (Array.isArray(shortcut.operator) ? _.contains(shortcut.operator, filter[0]): filter[0] === shortcut.operator ) &&
            _.isEqual(filter.slice(2), shortcut.values)
        );
    }

    onSetShortcut(shortcut) {
        let { filter } = this.props;
        let operator;
        if (Array.isArray(shortcut.operator)) {
            if (_.contains(shortcut.operator, filter[0])) {
                operator = filter[0];
            } else {
                operator = shortcut.operator[0];
            }
        } else {
            operator = shortcut.operator;
        }
        this.props.onFilterChange([operator, filter[1], ...shortcut.values])
    }

    render() {
        return (
            <div className="p1 pt2">
                <section>
                    { SHORTCUTS.map((s, index) =>
                        <span key={index} className={cx("inline-block half pb1", { "pr1": index % 2 === 0 })}>
                            <button
                                key={index}
                                className={cx("Button Button-normal Button--medium text-normal text-centered full", { "Button--purple": this.isSelectedShortcut(s) })}
                                onClick={() => this.onSetShortcut(s)}
                            >
                                {s.name}
                            </button>
                        </span>
                    )}
                </section>
                {Object.keys(RELATIVE_SHORTCUTS).map(sectionName =>
                    <section key={sectionName}>
                        <div style={{}} className="border-bottom text-uppercase flex layout-centered mb2">
                            <h6 style={{"position": "relative", "backgroundColor": "white", "top": "6px" }} className="px2">
                                {{sectionName}}
                            </h6>
                        </div>
                        <div className="flex">
                            { RELATIVE_SHORTCUTS[sectionName].map((s, index) =>
                                <button
                                    key={index}
                                    className={cx("Button Button-normal Button--medium flex-full mb1", { "Button--purple": this.isSelectedShortcut(s), "mr1": index !== RELATIVE_SHORTCUTS[sectionName].length - 1 })}
                                    onClick={() => this.onSetShortcut(s)}
                                >
                                    {s.name}
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </div>
        );
    }
}
