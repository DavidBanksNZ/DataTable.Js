import { DomElem} from './DomElem';

export class ColorCodedTable {

	theme(themeName) {
		this._theme = themeName;
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

	data(data) {
		this._data = data;
		return this;
	}

	render(container) {

		if (!Array.isArray(this._data)) {
			throw new Error('data must be an array');
		}

		this._tableElem = new DomElem('table');

		const numRows = this._data.length;
		const numCols = Math.max(...this._data.map(d => d.length));

		for (let i = 0; i < numRows; i++) {

			const tr = new DomElem('tr');

			for (let j = 0; j < numCols; j++) {
				const td = new DomElem('td');
				td.text(this._data[i][j]);
				tr.append(td);
			}

			this._tableElem.append(tr);

		}

		container.appendChild(this._tableElem.get());

		return this;
	}

	get() {
		return this._tableElem.get();
	}


}