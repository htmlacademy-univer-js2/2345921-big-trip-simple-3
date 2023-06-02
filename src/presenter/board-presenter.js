import CreationForm from '../view/creation-form';
import EditForm from '../view/edit-form';
import Sorting from '../view/sorting';
import WaypointView from '../view/event-item';
import WaypointList from '../view/event-list';
import {isEsc} from '../util';
import NoWaypointMessage from '../view/no-points';
import {render, replace} from '../framework/render';

export default class BoardPresenter {
  #waypointListComponent = null;
  #boardContainer = null;
  #waypointsModel = null;
  #noWaypointMessage = null;
  #sorters = null;

  constructor({boardContainer, waypointsModel, sorters}) {
    this.#boardContainer = boardContainer;
    this.#waypointsModel = waypointsModel;
    this.#sorters = sorters;
  }

  init() {
    const waypoints = [...this.#waypointsModel.arrWaypoints];
    if (waypoints.length === 0) {
      this.#noWaypointMessage = new NoWaypointMessage();
      render(this.#noWaypointMessage, this.#boardContainer);
    } else {
      this.#waypointListComponent = new WaypointList();
      render(new Sorting(this.#sorters), this.#boardContainer);
      render(this.#waypointListComponent, this.#boardContainer);
      render(new CreationForm(waypoints[0]), this.#waypointListComponent.element);

      for (let i = 1; i < 4; i++) {
        this.#renderWaypoint(waypoints[i]);
      }
    }
  }

  #renderWaypoint(waypoint) {
    const ecsHandler = (evt) => {
      if (isEsc(evt)) {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.body.removeEventListener('keydown', ecsHandler);
      }
    };
    const waypointComponent = new WaypointView({
      oneWaypoint: waypoint,
      onClick: () => {
        replaceWaypointToForm.call(this);
        document.body.addEventListener('keydown', ecsHandler);
      }
    });

    const formComponent = new EditForm({
      oneWaypoint: waypoint,
      onSubmit: () => {
        replaceFormToWaypoint.call(this);
        document.body.removeEventListener('keydown', ecsHandler);
      }
    });

    function replaceFormToWaypoint() {
      replace(waypointComponent, formComponent);
    }

    function replaceWaypointToForm(){
      replace(formComponent, waypointComponent);
    }

    render(waypointComponent, this.#waypointListComponent.element);
  }
}
