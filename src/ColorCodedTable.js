import { DomElem} from './DomElem';
import { DEFAULTS } from './defaults';
import { prefixCssClass } from './utils/prefixCssClass';

export class ColorCodedTable {

	constructor() {
		this._valueFormatter = val => val;
		this._rowLabelFormatter = label => label;
		this._columnLabelFormatter = label => label;
		this._cellFormatter = (elem, row, col, value) => {};
		this._styleFormatter = (row, col, value) => ({});
	}

	theme(themeName, themeConfig) {
		this._theme = themeName;
		this._themeConfig = themeConfig;
		return this;
	}

	data(data) {
		this._data = data;
		this._numRows = data.length;
		this._numCols = Math.max(...data.map(d => d.length));
		return this;
	}

	update() {
		this.destroy();
		this.render(this._container);
	}

	opts(opts) {
		this._opts = {...DEFAULTS, ...(opts || {})};
		return this;
	}

	rowLabels(labels) {
		this._rowLabels = labels;
		return this;
	}

	columnLabels(labels) {
		this._columnLabels = labels;
		return this;
	}

	rowLabelFormatter(fn) {
		this._rowLabelFormatter = fn;
		return this;
	}

	columnLabelFormatter(fn) {
		this._columnLabelFormatter = fn;
		return this;
	}

	valueFormatter(fn) {
		this._valueFormatter = fn;
		return this;
	}

	styleFormatter(fn) {
		this._styleFormatter = fn;
		return this;
	}

	cellFormatter(fn) {
		this._cellFormatter = fn;
		return this;
	}

	render(container) {

		if (!(container instanceof HTMLElement)) {
			throw new Error('container must be an HTML element');
		}

		if (!Array.isArray(this._data)) {
			throw new Error('data must be an array');
		}

		this._container = container;

		if (!this._opts) {
			this.opts();
		}

		this._tableElem = new DomElem('table')
			.addClass(prefixCssClass('table'));

		if (this._opts.showColumnLabels) {

			const columnHeadings = new DomElem('tr');

			for (let j = 0; j <= this._numCols; j++) {
				columnHeadings.append(new DomElem('th')
					.text(j > 0 ? this._columnLabelFormatter(this._columnLabels[j - 1]) : '')
					.addClass(prefixCssClass('column-label'))
				);
			}

			this._tableElem.append(columnHeadings);

		}

		for (let i = 0; i < this._numRows; i++) {

			const tr = new DomElem('tr');

			if (this._opts.showRowLabels) {
				tr.append(new DomElem('td')
					.text(this._rowLabelFormatter(this._rowLabels[i]))
					.addClass(prefixCssClass('row-label'))
				);
			}

			for (let j = 0; j < this._numCols; j++) {

				const value = this._data[i][j];

				const td = new DomElem('td')
					.text(this._valueFormatter(value))
					.addClass(prefixCssClass('data-cell'));

				this._cellFormatter(td, i, j, value);

				td.css(this._styleFormatter(i, j, value));

				tr.append(td);

			}

			this._tableElem.append(tr);

		}

		container.appendChild(this._tableElem.get());

		return this;
	}

	destroy() {
		const el = this.get();
		if (el) {
			el.parentNode.removeChild(el);
		}
		this._tableElem = null;
		return this;
	}

	get() {
		return this._tableElem.get();
	}

	static addTheme(theme) {
		this._themes[theme.name] = theme;
	}

}

ColorCodedTable._themes = Object.create(null);