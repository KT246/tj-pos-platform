# Requirements Document

## Introduction

The TJ POS Platform Admin is an administrative dashboard system designed for the internal team of TJ POS to manage a multi-tenant POS platform operating in Laos. The Platform Admin provides comprehensive tools for managing businesses, subscriptions, payments, add-ons, users, and system settings across all tenants. This system operates independently from the business owner portals and is accessible only to TJ POS internal staff (2-5 users).

## Glossary

- **Platform_Admin**: The administrative web application used by TJ POS internal team
- **Platform_Admin_User**: Internal TJ POS staff member with full administrative access
- **Business**: A registered tenant entity representing a single business using the TJ POS system
- **Business_Owner**: The person who owns and manages a Business account
- **Subscription**: A time-bound agreement linking a Business to a Plan with billing cycle
- **Plan**: A pricing tier (Free, Business, Pro, Enterprise) that defines features and limits
- **Add_on**: An optional module (POS, Inventory, Kitchen Display, etc.) that can be enabled for a Business
- **Module_Catalog**: The global repository of all available Add_ons
- **Payment_Record**: A transaction record documenting subscription payment by a Business
- **Payment_Method**: A means of payment (BCEL One, Cash, Bank Transfer, QR Code)
- **Audit_Log**: A tamper-evident record of administrative actions performed in the Platform_Admin
- **Trial_Period**: The initial free usage period for a new Business (default: 14 days)
- **Grace_Period**: The additional days after subscription expiration before suspension (default: 7 days)
- **Business_Status**: The operational state of a Business (trial, active, expired, suspended, cancelled)
- **Subscription_Status**: The state of a Subscription (trial, active, expired, past_due, cancelled)
- **Payment_Status**: The state of a Payment_Record (pending, confirmed, failed, refunded)
- **System_Settings**: Global configuration for the Platform_Admin including defaults, security, and maintenance
- **Multi_Tenant_Isolation**: Architectural pattern ensuring each Business's data is completely separated

## Requirements

### Requirement 1: Platform Admin User Authentication

**User Story:** As a Platform Admin User, I want to securely authenticate into the Platform Admin, so that only authorized TJ POS internal staff can access administrative functions.

#### Acceptance Criteria

1. WHEN a Platform_Admin_User submits valid credentials, THE Authentication_System SHALL create an authenticated session
2. WHEN a Platform_Admin_User submits invalid credentials, THE Authentication_System SHALL reject the login attempt and return an error message
3. WHERE two-factor authentication is enabled, THE Authentication_System SHALL require a valid OTP code after password verification
4. WHEN a Platform_Admin_User session exceeds the configured timeout period, THE Authentication_System SHALL terminate the session
5. THE Authentication_System SHALL enforce a minimum password length of 8 characters
6. WHEN a Platform_Admin_User logs in successfully, THE Audit_Log SHALL record the login event with timestamp and IP address

### Requirement 2: Business Management

**User Story:** As a Platform Admin User, I want to view and manage all registered Businesses, so that I can monitor platform usage and handle business lifecycle operations.

#### Acceptance Criteria

1. THE Business_List_View SHALL display all Businesses with name, owner, plan, status, and last activity
2. WHEN a Platform_Admin_User applies search criteria, THE Business_List_View SHALL filter results matching the search term against business name or owner name
3. WHEN a Platform_Admin_User applies status filter, THE Business_List_View SHALL display only Businesses matching the selected status
4. THE Business_List_View SHALL paginate results with configurable page size (default: 20 items per page)
5. WHEN a Platform_Admin_User selects a Business, THE Business_Detail_View SHALL display comprehensive information including owner details, subscription status, enabled modules, and activity history
6. WHEN a Platform_Admin_User suspends a Business, THE Business_Management_System SHALL change Business_Status to suspended and record the action in Audit_Log
7. WHEN a Platform_Admin_User activates a suspended Business, THE Business_Management_System SHALL change Business_Status to active and record the action in Audit_Log
8. FOR ALL Business operations (create, update, suspend, activate, delete), the Audit_Log SHALL record the actor, action, timestamp, and affected resource

### Requirement 3: Business Owner Management

**User Story:** As a Platform Admin User, I want to manage Business Owner accounts, so that I can assist with account issues and monitor owner activity.

#### Acceptance Criteria

1. THE Owner_List_View SHALL display all Business_Owners with name, email, phone, associated businesses, status, and last login time
2. WHEN a Platform_Admin_User searches for an owner, THE Owner_List_View SHALL filter results matching the search term against owner name, email, or phone
3. WHEN a Platform_Admin_User views an owner profile, THE Owner_Detail_View SHALL display owner information, associated businesses, activity history, and security settings
4. WHEN a Platform_Admin_User resets an owner password, THE Owner_Management_System SHALL generate a password reset token and send it to the owner's email
5. WHEN a Platform_Admin_User enables or disables an owner account, THE Owner_Management_System SHALL update the account status and record the action in Audit_Log
6. THE Owner_Detail_View SHALL display the last login IP address and timestamp for security monitoring

### Requirement 4: Platform Admin User Management

**User Story:** As a Platform Admin User, I want to manage other Platform Admin Users, so that I can control who has administrative access to the platform.

#### Acceptance Criteria

1. THE Platform_User_List_View SHALL display all Platform_Admin_Users with name, email, role, status, and last login
2. WHEN a Platform_Admin_User creates a new admin account, THE User_Management_System SHALL validate email uniqueness and create the account with Platform Admin role
3. WHEN a Platform_Admin_User deactivates an admin account, THE User_Management_System SHALL set status to inactive and terminate all active sessions for that account
4. THE User_Management_System SHALL enforce a single role model where all Platform_Admin_Users have full administrative access
5. WHEN a Platform_Admin_User modifies another admin account, THE Audit_Log SHALL record the modification with actor and affected user identifiers

### Requirement 5: Plan Management

**User Story:** As a Platform Admin User, I want to manage subscription Plans, so that I can define pricing tiers and feature limits for businesses.

#### Acceptance Criteria

1. THE Plan_List_View SHALL display all Plans with name, price, billing cycle, feature limits, and count of active subscriptions
2. WHEN a Platform_Admin_User creates a Plan, THE Plan_Management_System SHALL validate required fields (name, price, currency, billing_cycle) and persist the Plan
3. WHEN a Platform_Admin_User updates a Plan, THE Plan_Management_System SHALL apply changes without affecting existing active Subscriptions unless explicitly migrated
4. THE Plan SHALL define limits for branches, POS devices, and staff members
5. THE Plan_Management_System SHALL support four pricing tiers: Free, Business, Pro, and Enterprise
6. WHEN a Plan is deleted, THE Plan_Management_System SHALL prevent deletion if active Subscriptions reference the Plan

### Requirement 6: Subscription Management

**User Story:** As a Platform Admin User, I want to manage all Subscriptions, so that I can track billing cycles, renewals, and subscription lifecycle.

#### Acceptance Criteria

1. THE Subscription_List_View SHALL display all Subscriptions with business name, plan name, billing cycle, next renewal date, amount, and status
2. WHEN a Platform_Admin_User filters by subscription status, THE Subscription_List_View SHALL display only Subscriptions matching the selected status
3. WHEN a Platform_Admin_User filters by renewal date range, THE Subscription_List_View SHALL display Subscriptions with next_renewal_date within the specified range
4. WHEN a Platform_Admin_User views a Subscription, THE Subscription_Detail_View SHALL display subscription history, payment records, and upcoming renewal information
5. WHEN a Subscription expires and the Grace_Period elapses, THE Subscription_Management_System SHALL automatically suspend the associated Business if auto-suspend is enabled
6. WHEN a Platform_Admin_User manually renews a Subscription, THE Subscription_Management_System SHALL extend the subscription period and update next_renewal_date
7. THE Subscription_Management_System SHALL support monthly and annual billing cycles

### Requirement 7: Payment Tracking and Confirmation

**User Story:** As a Platform Admin User, I want to track and confirm subscription payments, so that I can ensure accurate billing and handle manual payment verification.

#### Acceptance Criteria

1. THE Payment_List_View SHALL display all Payment_Records with payment ID, business name, payment method, amount, status, and payment date
2. WHEN a Platform_Admin_User filters by payment status, THE Payment_List_View SHALL display only Payment_Records matching the selected status
3. WHEN a Platform_Admin_User filters by payment method, THE Payment_List_View SHALL display only Payment_Records using the selected Payment_Method
4. WHEN a Platform_Admin_User confirms a pending payment, THE Payment_Management_System SHALL change Payment_Status to confirmed, update the associated Subscription, and record the action in Audit_Log
5. WHEN a Platform_Admin_User marks a payment as failed, THE Payment_Management_System SHALL change Payment_Status to failed and record the reason
6. THE Payment_Detail_View SHALL display payment proof images or transaction references when available
7. THE Payment_Management_System SHALL support BCEL One, Cash, Bank Transfer, and QR Code as Payment_Methods

### Requirement 8: Payment Settings Management

**User Story:** As a Platform Admin User, I want to configure payment settings, so that I can manage banks, accounts, QR codes, and settlement configurations.

#### Acceptance Criteria

1. THE Payment_Settings_View SHALL display all configured Payment_Methods with provider, channel, status, and usage statistics
2. WHEN a Platform_Admin_User adds a bank account, THE Payment_Settings_System SHALL validate required fields (bank_name, account_number, account_holder) and persist the configuration
3. WHEN a Platform_Admin_User uploads a QR code template, THE Payment_Settings_System SHALL validate the image format and associate it with the payment method
4. THE Payment_Settings_System SHALL allow marking a Payment_Method as default for the platform
5. WHEN a Platform_Admin_User disables a Payment_Method, THE Payment_Settings_System SHALL prevent new payments using that method while preserving historical records
6. THE Payment_Settings_View SHALL categorize Payment_Methods by channel (Mobile Banking, QR Code, POS Terminal)

### Requirement 9: Add-on Module Management

**User Story:** As a Platform Admin User, I want to manage add-on modules for businesses, so that I can enable or disable optional features per business.

#### Acceptance Criteria

1. THE Add_On_List_View SHALL display all Add_ons with name, category, enabled business count, monthly price, and status
2. WHEN a Platform_Admin_User views a Business detail, THE Business_Module_View SHALL display all enabled Add_ons for that Business
3. WHEN a Platform_Admin_User enables an Add_on for a Business, THE Add_On_Management_System SHALL grant access to the module and record the action in Audit_Log
4. WHEN a Platform_Admin_User disables an Add_on for a Business, THE Add_On_Management_System SHALL revoke access to the module and record the action in Audit_Log
5. THE Add_On_Management_System SHALL track which Businesses have each Add_on enabled
6. WHEN an Add_on is disabled globally, THE Add_On_Management_System SHALL prevent new activations while preserving existing enabled instances

### Requirement 10: Global Module Catalog Management

**User Story:** As a Platform Admin User, I want to manage the global Module Catalog, so that I can define which modules are available for businesses to enable.

#### Acceptance Criteria

1. THE Module_Catalog_View SHALL display all modules with name, category (Core, Add-on), availability rule (required, default, optional), and status
2. WHEN a Platform_Admin_User creates a module, THE Module_Catalog_System SHALL validate required fields (name, category, pricing) and add it to the Module_Catalog
3. WHEN a Platform_Admin_User updates a module, THE Module_Catalog_System SHALL apply changes and reflect them in the Add_On_List_View
4. THE Module_Catalog SHALL categorize modules as Core (POS, Inventory) or Add-on (Kitchen Display, Customer Display, etc.)
5. WHEN a module is marked as required, THE Module_Catalog_System SHALL automatically enable it for all new Businesses
6. WHEN a module is marked as default, THE Module_Catalog_System SHALL enable it for new Businesses unless explicitly disabled

### Requirement 11: System Settings Management

**User Story:** As a Platform Admin User, I want to configure system-wide settings, so that I can control defaults, security policies, and maintenance mode.

#### Acceptance Criteria

1. THE System_Settings_View SHALL display sections for general settings, subscription defaults, security settings, and maintenance mode
2. WHEN a Platform_Admin_User updates general settings, THE System_Settings SHALL persist platform name, company name, support email, support phone, default language, and timezone
3. WHEN a Platform_Admin_User updates subscription defaults, THE System_Settings SHALL persist trial period days, grace period days, and invoice prefix
4. WHEN a Platform_Admin_User enables auto-suspend, THE Subscription_Management_System SHALL automatically suspend businesses after Grace_Period expiration
5. WHEN a Platform_Admin_User enables 2FA requirement, THE Authentication_System SHALL enforce two-factor authentication for all Platform_Admin_Users
6. WHEN a Platform_Admin_User configures session timeout, THE Authentication_System SHALL enforce the specified timeout duration in minutes
7. WHEN a Platform_Admin_User enables maintenance mode, THE Platform_Admin SHALL display a maintenance message and start/end time to Business_Owners attempting to access their portals

### Requirement 12: Audit Logging

**User Story:** As a Platform Admin User, I want to view audit logs of all administrative actions, so that I can track changes and investigate security incidents.

#### Acceptance Criteria

1. THE Audit_Log_View SHALL display all logged actions with timestamp, actor, action type, resource type, resource identifier, and result status
2. WHEN a Platform_Admin_User filters by actor, THE Audit_Log_View SHALL display only actions performed by the selected Platform_Admin_User
3. WHEN a Platform_Admin_User filters by action type, THE Audit_Log_View SHALL display only actions matching the selected type
4. WHEN a Platform_Admin_User filters by date range, THE Audit_Log_View SHALL display only actions within the specified time period
5. THE Audit_Log SHALL record all CRUD operations on Businesses, Subscriptions, Payments, Plans, Add_ons, and System_Settings
6. THE Audit_Log SHALL record authentication events including successful logins, failed login attempts, and logouts
7. WHEN a Platform_Admin_User exports audit logs, THE Audit_Log_System SHALL generate a downloadable file containing filtered log entries
8. THE Audit_Log_System SHALL store logs with immutable timestamps and prevent modification or deletion of existing log entries

### Requirement 13: Dashboard Analytics

**User Story:** As a Platform Admin User, I want to view platform-wide analytics on a dashboard, so that I can monitor key metrics at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display total count of active Businesses
2. THE Dashboard SHALL display count of Businesses by Business_Status (trial, active, expired, suspended)
3. THE Dashboard SHALL display total monthly recurring revenue calculated from active Subscriptions
4. THE Dashboard SHALL display count of pending Payment_Records requiring confirmation
5. THE Dashboard SHALL display count of Subscriptions expiring within the next 7 days
6. THE Dashboard SHALL display recent activity feed showing latest administrative actions from Audit_Log
7. WHEN a Platform_Admin_User views the Dashboard, THE Dashboard SHALL refresh metrics from current database state

### Requirement 14: Business Lifecycle Automation

**User Story:** As a Platform Admin User, I want the system to automatically manage business lifecycle transitions, so that subscription expiration and suspension are handled consistently.

#### Acceptance Criteria

1. WHEN a Subscription reaches its end_date, THE Subscription_Management_System SHALL change Subscription_Status to expired
2. WHEN a Subscription_Status is expired and Grace_Period elapses, THE Business_Management_System SHALL change Business_Status to suspended if auto-suspend is enabled in System_Settings
3. WHEN a Business_Status changes to suspended, THE Business_Access_Control SHALL prevent Business_Owner login to the business portal
4. WHEN a Platform_Admin_User reactivates a suspended Business, THE Business_Management_System SHALL change Business_Status to active and restore access
5. WHEN a Business is in Trial_Period and the period expires without payment, THE Subscription_Management_System SHALL change Subscription_Status to expired
6. THE Business_Lifecycle_System SHALL run daily batch processing to identify and process expired subscriptions and grace period expirations

### Requirement 15: Multi-Tenant Data Isolation

**User Story:** As a Platform Admin User, I want each Business's data to be completely isolated, so that data security and privacy are maintained across all tenants.

#### Acceptance Criteria

1. WHEN the System retrieves data for a Business, THE Data_Access_Layer SHALL filter all queries by the Business identifier
2. WHEN a Business_Owner accesses their portal, THE Business_Portal SHALL display only data belonging to their Business
3. THE Database_Schema SHALL enforce foreign key constraints linking all business-specific data to a Business identifier
4. WHEN a Business is deleted, THE Data_Management_System SHALL cascade delete or anonymize all associated data (transactions, staff, customers, inventory)
5. THE Multi_Tenant_Architecture SHALL prevent cross-tenant data leakage through API endpoints, reports, and exports
6. WHEN the Platform_Admin displays business lists or aggregates, THE Data_Access_Layer SHALL correctly isolate and aggregate data by Business

### Requirement 16: Search and Filtering Capabilities

**User Story:** As a Platform Admin User, I want robust search and filtering across all entity lists, so that I can quickly find specific records among thousands of entries.

#### Acceptance Criteria

1. WHEN a Platform_Admin_User enters a search term in Business_List_View, THE Search_System SHALL match against business name, owner name, and owner email
2. WHEN a Platform_Admin_User enters a search term in Owner_List_View, THE Search_System SHALL match against owner name, email, and phone number
3. WHEN a Platform_Admin_User enters a search term in Payment_List_View, THE Search_System SHALL match against payment ID, business name, and transaction reference
4. THE Search_System SHALL return results within 2 seconds for datasets up to 10,000 records
5. WHEN multiple filters are applied simultaneously, THE Filter_System SHALL apply AND logic across all selected filters
6. THE Filter_System SHALL provide filter options for status, date ranges, payment methods, plans, and business categories

### Requirement 17: Pagination and Data Loading

**User Story:** As a Platform Admin User, I want efficient pagination for large data sets, so that the interface remains responsive even with thousands of records.

#### Acceptance Criteria

1. THE Pagination_Component SHALL display page numbers, previous/next navigation, and page size selector
2. WHEN a Platform_Admin_User changes page size, THE List_View SHALL reload with the selected number of items per page (10, 20, 50, 100)
3. THE Pagination_System SHALL load only the requested page of results from the database (server-side pagination)
4. THE List_View SHALL display total record count and current page range (e.g., "Showing 21-40 of 156")
5. WHEN navigating between pages, THE List_View SHALL preserve applied filters and search criteria
6. THE Pagination_System SHALL handle first page, last page, and direct page number navigation

### Requirement 18: Notification Template Management

**User Story:** As a Platform Admin User, I want to manage notification templates, so that I can customize emails and alerts sent to Business_Owners.

#### Acceptance Criteria

1. THE Template_List_View SHALL display all notification templates with name, channel (Email, SMS, System), trigger event, and status
2. WHEN a Platform_Admin_User creates a template, THE Template_Management_System SHALL validate required fields (name, channel, subject, body) and persist the template
3. WHEN a Platform_Admin_User edits a template, THE Template_Management_System SHALL support template variables (e.g., {{business_name}}, {{owner_name}}, {{amount}})
4. THE Template_Management_System SHALL support multiple languages (Lao, English) per template
5. WHEN a trigger event occurs (payment confirmation, subscription expiration), THE Notification_System SHALL use the corresponding template to send notifications
6. WHEN a Platform_Admin_User disables a template, THE Notification_System SHALL not send notifications for that trigger event

### Requirement 19: Profile and Security Management

**User Story:** As a Platform Admin User, I want to manage my own profile and security settings, so that I can maintain my account security.

#### Acceptance Criteria

1. THE Profile_View SHALL display Platform_Admin_User name, email, phone, role, and profile picture
2. WHEN a Platform_Admin_User updates profile information, THE Profile_System SHALL validate and persist the changes
3. WHEN a Platform_Admin_User changes password, THE Profile_System SHALL require current password verification and enforce minimum password length
4. WHEN a Platform_Admin_User enables 2FA, THE Security_System SHALL generate a QR code for authenticator app enrollment
5. THE Security_Settings_View SHALL display active sessions with device information, IP address, and last activity timestamp
6. WHEN a Platform_Admin_User terminates a session, THE Security_System SHALL invalidate the session token and force logout on that device

### Requirement 20: Data Export Capabilities

**User Story:** As a Platform Admin User, I want to export data to files, so that I can perform offline analysis and generate reports.

#### Acceptance Criteria

1. WHEN a Platform_Admin_User exports from Business_List_View, THE Export_System SHALL generate a CSV file containing all filtered businesses with key fields
2. WHEN a Platform_Admin_User exports from Payment_List_View, THE Export_System SHALL generate a CSV file containing all filtered payments with transaction details
3. WHEN a Platform_Admin_User exports from Audit_Log_View, THE Export_System SHALL generate a CSV or JSON file containing filtered log entries
4. THE Export_System SHALL respect applied filters and search criteria when generating export files
5. THE Export_System SHALL complete file generation within 30 seconds for datasets up to 5,000 records
6. WHEN an export completes, THE Export_System SHALL provide a download link or trigger automatic file download

### Requirement 21: Currency and Localization

**User Story:** As a Platform Admin User, I want the system to properly handle Lao currency and timezone, so that all financial and temporal data is displayed correctly.

#### Acceptance Criteria

1. THE Platform_Admin SHALL display all monetary amounts in Lao Kip (LAK) with proper formatting (e.g., "K 1,200,000")
2. THE Platform_Admin SHALL display all dates and times in Asia/Vientiane timezone
3. WHEN displaying relative time (e.g., "5 minutes ago"), THE Time_Display_System SHALL calculate relative to current time in Asia/Vientiane timezone
4. THE Platform_Admin SHALL support Lao language UI labels and English as fallback
5. THE Currency_System SHALL store amounts as integers representing the smallest currency unit (kip) to avoid floating-point precision issues
6. WHEN formatting large numbers, THE Number_Format_System SHALL use locale-appropriate thousands separators

### Requirement 22: Subscription Trial Management

**User Story:** As a Platform Admin User, I want to manage trial periods for new businesses, so that I can control the initial free usage period.

#### Acceptance Criteria

1. WHEN a new Business registers, THE Subscription_Management_System SHALL create a Subscription with Subscription_Status set to trial and end_date calculated from Trial_Period days
2. THE Trial_Period duration SHALL be configurable in System_Settings (default: 14 days)
3. WHEN a trial Subscription reaches end_date, THE Subscription_Management_System SHALL change Subscription_Status to expired
4. THE Dashboard SHALL display count of Businesses currently in trial period
5. WHEN a Platform_Admin_User converts a trial to paid subscription, THE Subscription_Management_System SHALL change Subscription_Status to active and set new end_date based on billing cycle
6. THE Business_List_View SHALL visually distinguish trial businesses from paid businesses

### Requirement 23: Payment Method Usage Analytics

**User Story:** As a Platform Admin User, I want to see analytics on payment method usage, so that I can understand which payment channels are most popular.

#### Acceptance Criteria

1. THE Payment_Settings_View SHALL display count of Payment_Records grouped by Payment_Method
2. THE Payment_Settings_View SHALL display percentage distribution of payments across Payment_Methods
3. THE Payment_Analytics SHALL calculate total transaction volume per Payment_Method
4. THE Payment_Settings_View SHALL display trend indicators showing payment method usage changes from previous period
5. WHEN a Platform_Admin_User views payment analytics, THE Analytics_System SHALL visualize data using charts (donut chart for distribution, bar chart for volumes)

### Requirement 24: Manual Subscription Adjustment

**User Story:** As a Platform Admin User, I want to manually adjust subscriptions, so that I can handle special cases and customer service requests.

#### Acceptance Criteria

1. WHEN a Platform_Admin_User extends a Subscription end_date, THE Subscription_Management_System SHALL update end_date and record the adjustment in Audit_Log with reason
2. WHEN a Platform_Admin_User changes a Subscription plan, THE Subscription_Management_System SHALL update the plan reference and recalculate billing amount
3. WHEN a Platform_Admin_User applies a discount to a Subscription, THE Subscription_Management_System SHALL store the discount amount or percentage and apply it to billing calculations
4. WHEN a Platform_Admin_User cancels a Subscription, THE Subscription_Management_System SHALL change Subscription_Status to cancelled and set cancellation_date
5. THE Manual_Adjustment_System SHALL require a mandatory reason field for all manual adjustments
6. THE Audit_Log SHALL record all subscription adjustments with previous values, new values, actor, and reason

### Requirement 25: Business Status Visualization

**User Story:** As a Platform Admin User, I want clear visual indicators for business and subscription status, so that I can quickly assess health at a glance.

#### Acceptance Criteria

1. THE Status_Badge_Component SHALL display distinct colors for each status: trial (blue), active (green), expired (orange), suspended (red), cancelled (gray)
2. THE Business_List_View SHALL use Status_Badge_Component to display Business_Status
3. THE Subscription_List_View SHALL use Status_Badge_Component to display Subscription_Status
4. THE Payment_List_View SHALL use Status_Badge_Component to display Payment_Status
5. WHEN a Business_Status is suspended, THE Business_List_View SHALL display an alert icon next to the status badge
6. THE Dashboard SHALL use color-coded metrics cards to display counts by status category
