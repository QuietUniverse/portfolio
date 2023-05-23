import View from "./view.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkupPrev(currPage = this._data.page) {
    return `
      <button data-goto=${
        currPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
      </button>
      `;
  }

  _generateMarkupNext(currPage = this._data.page) {
    return `
      <button data-goto=${
        currPage + 1
      } class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
      </button>
      `;
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupNext();
    }

    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupPrev();
    }

    if (currPage < numPages) {
      return [this._generateMarkupPrev(), this._generateMarkupNext()].join("");
    }

    return ``;
  }
}

export default new PaginationView();
