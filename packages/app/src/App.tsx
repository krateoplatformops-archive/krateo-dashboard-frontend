/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_PART,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
} from '@backstage/catalog-model';
import { createApp } from '@backstage/app-defaults';
import { FlatRoutes } from '@backstage/core-app-api';
import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
} from '@backstage/core-components';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import { AzurePullRequestsPage } from '@backstage/plugin-azure-devops';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import {
  CostInsightsLabelDataflowInstructionsPage,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
} from '@backstage/plugin-cost-insights';
import { ExplorePage, explorePlugin } from '@backstage/plugin-explore';
import { GcpProjectsPage } from '@backstage/plugin-gcp-projects';
import { GraphiQLPage } from '@backstage/plugin-graphiql';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { LighthousePage } from '@backstage/plugin-lighthouse';
import { NewRelicPage } from '@backstage/plugin-newrelic';
import {
  ScaffolderFieldExtensions,
  ScaffolderPage,
  scaffolderPlugin,
} from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import {
  DefaultTechDocsHome,
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import AlarmIcon from '@material-ui/icons/Alarm';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Navigate, Route } from 'react-router';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { HomePage } from './components/home/HomePage';
import { Root } from './components/Root';
import { LowerCaseValuePickerFieldExtension } from './components/scaffolder/customScaffolderExtensions';
import { searchPage } from './components/search/SearchPage';
import { providers } from './identityProviders';
import * as plugins from './plugins';

import { techDocsPage } from './components/techdocs/TechDocsPage';
import { ApacheAirflowPage } from '@backstage/plugin-apache-airflow';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  icons: {
    // Custom icon example
    alert: AlarmIcon,
  },
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(catalogGraphPlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
    bind(apiDocsPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
    bind(explorePlugin.externalRoutes, {
      catalogEntity: catalogPlugin.routes.catalogEntity,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
  <FlatRoutes>
    <Navigate key="/" to="catalog" />
    {/* TODO(rubenl): Move this to / once its more mature and components exist */}
    <Route path="/home" element={<HomepageCompositionRoot />}>
      <HomePage />
    </Route>
    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/catalog-import" element={<CatalogImportPage />} />
    <Route
      path="/catalog-graph"
      element={
        <CatalogGraphPage
          initialState={{
            selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
            selectedRelations: [
              RELATION_OWNER_OF,
              RELATION_OWNED_BY,
              RELATION_CONSUMES_API,
              RELATION_API_CONSUMED_BY,
              RELATION_PROVIDES_API,
              RELATION_API_PROVIDED_BY,
              RELATION_HAS_PART,
              RELATION_PART_OF,
              RELATION_DEPENDS_ON,
              RELATION_DEPENDENCY_OF,
            ],
          }}
        />
      }
    />
    <Route path="/docs" element={<TechDocsIndexPage />}>
      <DefaultTechDocsHome />
    </Route>
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      {techDocsPage}
    </Route>
    <Route
      path="/create"
      element={
        <ScaffolderPage
          groups={[
            {
              title: 'Recommended',
              filter: entity =>
                entity?.metadata?.tags?.includes('recommended') ?? false,
            },
          ]}
        />
      }
    >
      <ScaffolderFieldExtensions>
        <LowerCaseValuePickerFieldExtension />
      </ScaffolderFieldExtensions>
    </Route>
    <Route path="/explore" element={<ExplorePage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/lighthouse" element={<LighthousePage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route path="/gcp-projects" element={<GcpProjectsPage />} />
    <Route path="/newrelic" element={<NewRelicPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route
      path="/cost-insights/investigating-growth"
      element={<CostInsightsProjectGrowthInstructionsPage />}
    />
    <Route
      path="/cost-insights/labeling-jobs"
      element={<CostInsightsLabelDataflowInstructionsPage />}
    />
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/azure-pull-requests" element={<AzurePullRequestsPage />} />
    <Route path="/apache-airflow" element={<ApacheAirflowPage />} />
  </FlatRoutes>
);

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
);

export default hot(App);
