import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Schedule e2e test', () => {
  const schedulePageUrl = '/schedule';
  const schedulePageUrlPattern = new RegExp('/schedule(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const scheduleSample = {"area":"Inverse","region":"protocol Cotton"};

  let schedule;
  // let onDuty;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/on-duties',
      body: {"dutyNo":"protocol interactive efficient"},
    }).then(({ body }) => {
      onDuty = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/schedules+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/schedules').as('postEntityRequest');
    cy.intercept('DELETE', '/api/schedules/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/on-duties', {
      statusCode: 200,
      body: [onDuty],
    });

  });
   */

  afterEach(() => {
    if (schedule) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/schedules/${schedule.id}`,
      }).then(() => {
        schedule = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (onDuty) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/on-duties/${onDuty.id}`,
      }).then(() => {
        onDuty = undefined;
      });
    }
  });
   */

  it('Schedules menu should load Schedules page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('schedule');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Schedule').should('exist');
    cy.url().should('match', schedulePageUrlPattern);
  });

  describe('Schedule page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(schedulePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Schedule page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/schedule/new$'));
        cy.getEntityCreateUpdateHeading('Schedule');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', schedulePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/schedules',
          body: {
            ...scheduleSample,
            onDuty: onDuty,
          },
        }).then(({ body }) => {
          schedule = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/schedules+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [schedule],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(schedulePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(schedulePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Schedule page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('schedule');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', schedulePageUrlPattern);
      });

      it('edit button click should load edit Schedule page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Schedule');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', schedulePageUrlPattern);
      });

      it('edit button click should load edit Schedule page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Schedule');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', schedulePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Schedule', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('schedule').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', schedulePageUrlPattern);

        schedule = undefined;
      });
    });
  });

  describe('new Schedule page', () => {
    beforeEach(() => {
      cy.visit(`${schedulePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Schedule');
    });

    it.skip('should create an instance of Schedule', () => {
      cy.get(`[data-cy="area"]`).type('parsing Borders olive').should('have.value', 'parsing Borders olive');

      cy.get(`[data-cy="region"]`).type('Integration').should('have.value', 'Integration');

      cy.get(`[data-cy="state"]`).select('Kedah');

      cy.get(`[data-cy="activity"]`).select('Collector');

      cy.get(`[data-cy="date"]`).type('2023-02-28').blur().should('have.value', '2023-02-28');

      cy.get(`[data-cy="day"]`).select('Sunday');

      cy.get(`[data-cy="onDuty"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        schedule = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', schedulePageUrlPattern);
    });
  });
});
