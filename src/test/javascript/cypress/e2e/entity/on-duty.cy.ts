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

describe('OnDuty e2e test', () => {
  const onDutyPageUrl = '/on-duty';
  const onDutyPageUrlPattern = new RegExp('/on-duty(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const onDutySample = {};

  let onDuty;
  let staff;
  let transport;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/staff',
      body: {
        regNo: 'next-gener',
        license: 'No',
        gender: 'Female',
        name: 'Money Borders incubate',
        address: 'programming Keyboard',
        contactNo: 'Avon Optimized',
      },
    }).then(({ body }) => {
      staff = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/transports',
      body: { transportNo: 'Intranet', regsNo: 'Borders', type: 'Other' },
    }).then(({ body }) => {
      transport = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/on-duties+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/on-duties').as('postEntityRequest');
    cy.intercept('DELETE', '/api/on-duties/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/staff', {
      statusCode: 200,
      body: [staff],
    });

    cy.intercept('GET', '/api/transports', {
      statusCode: 200,
      body: [transport],
    });
  });

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

  afterEach(() => {
    if (staff) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/staff/${staff.id}`,
      }).then(() => {
        staff = undefined;
      });
    }
    if (transport) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/transports/${transport.id}`,
      }).then(() => {
        transport = undefined;
      });
    }
  });

  it('OnDuties menu should load OnDuties page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('on-duty');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OnDuty').should('exist');
    cy.url().should('match', onDutyPageUrlPattern);
  });

  describe('OnDuty page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(onDutyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OnDuty page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/on-duty/new$'));
        cy.getEntityCreateUpdateHeading('OnDuty');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', onDutyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/on-duties',
          body: {
            ...onDutySample,
            staff: staff,
            transport: transport,
          },
        }).then(({ body }) => {
          onDuty = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/on-duties+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [onDuty],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(onDutyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OnDuty page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('onDuty');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', onDutyPageUrlPattern);
      });

      it('edit button click should load edit OnDuty page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OnDuty');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', onDutyPageUrlPattern);
      });

      it('edit button click should load edit OnDuty page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OnDuty');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', onDutyPageUrlPattern);
      });

      it('last delete button click should delete instance of OnDuty', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('onDuty').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', onDutyPageUrlPattern);

        onDuty = undefined;
      });
    });
  });

  describe('new OnDuty page', () => {
    beforeEach(() => {
      cy.visit(`${onDutyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OnDuty');
    });

    it('should create an instance of OnDuty', () => {
      cy.get(`[data-cy="dutyNo"]`).type('optimize').should('have.value', 'optimize');

      cy.get(`[data-cy="staff"]`).select(1);
      cy.get(`[data-cy="transport"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        onDuty = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', onDutyPageUrlPattern);
    });
  });
});
