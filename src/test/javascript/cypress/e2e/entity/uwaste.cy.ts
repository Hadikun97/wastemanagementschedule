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

describe('Uwaste e2e test', () => {
  const uwastePageUrl = '/uwaste';
  const uwastePageUrlPattern = new RegExp('/uwaste(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const uwasteSample = {
    name: 'Kentucky client-server',
    contactNo: 'card Tools',
    address: 'methodologies transmitting bandwidth-monitored',
  };

  let uwaste;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/uwastes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/uwastes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/uwastes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (uwaste) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/uwastes/${uwaste.id}`,
      }).then(() => {
        uwaste = undefined;
      });
    }
  });

  it('Uwastes menu should load Uwastes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('uwaste');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Uwaste').should('exist');
    cy.url().should('match', uwastePageUrlPattern);
  });

  describe('Uwaste page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(uwastePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Uwaste page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/uwaste/new$'));
        cy.getEntityCreateUpdateHeading('Uwaste');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', uwastePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/uwastes',
          body: uwasteSample,
        }).then(({ body }) => {
          uwaste = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/uwastes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [uwaste],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(uwastePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Uwaste page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('uwaste');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', uwastePageUrlPattern);
      });

      it('edit button click should load edit Uwaste page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Uwaste');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', uwastePageUrlPattern);
      });

      it('edit button click should load edit Uwaste page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Uwaste');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', uwastePageUrlPattern);
      });

      it('last delete button click should delete instance of Uwaste', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('uwaste').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', uwastePageUrlPattern);

        uwaste = undefined;
      });
    });
  });

  describe('new Uwaste page', () => {
    beforeEach(() => {
      cy.visit(`${uwastePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Uwaste');
    });

    it('should create an instance of Uwaste', () => {
      cy.get(`[data-cy="description"]`).type('Optimization').should('have.value', 'Optimization');

      cy.get(`[data-cy="name"]`).type('syndicate').should('have.value', 'syndicate');

      cy.get(`[data-cy="contactNo"]`).type('Macao').should('have.value', 'Macao');

      cy.get(`[data-cy="address"]`).type('Home engine').should('have.value', 'Home engine');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        uwaste = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', uwastePageUrlPattern);
    });
  });
});
