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

describe('Bulletin e2e test', () => {
  const bulletinPageUrl = '/bulletin';
  const bulletinPageUrlPattern = new RegExp('/bulletin(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bulletinSample = {
    title: 'silver array',
    description: 'programming',
    name: 'circuit transmitter full-range',
    contactNo: 'Guiana matrix',
  };

  let bulletin;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/bulletins+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/bulletins').as('postEntityRequest');
    cy.intercept('DELETE', '/api/bulletins/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bulletin) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/bulletins/${bulletin.id}`,
      }).then(() => {
        bulletin = undefined;
      });
    }
  });

  it('Bulletins menu should load Bulletins page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('bulletin');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Bulletin').should('exist');
    cy.url().should('match', bulletinPageUrlPattern);
  });

  describe('Bulletin page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bulletinPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Bulletin page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/bulletin/new$'));
        cy.getEntityCreateUpdateHeading('Bulletin');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bulletinPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/bulletins',
          body: bulletinSample,
        }).then(({ body }) => {
          bulletin = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/bulletins+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [bulletin],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(bulletinPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Bulletin page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bulletin');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bulletinPageUrlPattern);
      });

      it('edit button click should load edit Bulletin page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bulletin');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bulletinPageUrlPattern);
      });

      it('edit button click should load edit Bulletin page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bulletin');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bulletinPageUrlPattern);
      });

      it('last delete button click should delete instance of Bulletin', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('bulletin').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bulletinPageUrlPattern);

        bulletin = undefined;
      });
    });
  });

  describe('new Bulletin page', () => {
    beforeEach(() => {
      cy.visit(`${bulletinPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Bulletin');
    });

    it('should create an instance of Bulletin', () => {
      cy.get(`[data-cy="title"]`).type('Ergonomic EXE Alabama').should('have.value', 'Ergonomic EXE Alabama');

      cy.get(`[data-cy="description"]`).type('interface Marketing Handmade').should('have.value', 'interface Marketing Handmade');

      cy.get(`[data-cy="name"]`).type('real-time Handcrafted').should('have.value', 'real-time Handcrafted');

      cy.get(`[data-cy="contactNo"]`).type('cross-platform execu').should('have.value', 'cross-platform execu');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        bulletin = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', bulletinPageUrlPattern);
    });
  });
});
