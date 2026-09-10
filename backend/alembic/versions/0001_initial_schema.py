"""Initial database schema with projects, users, plans, bloggers, and companies

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-09 17:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Enums
    role_enum = postgresql.ENUM('employee', 'manager', 'admin', 'super_admin', name='roleenum', create_type=False)
    role_enum.create(op.get_bind(), checkfirst=True)

    status_enum = postgresql.ENUM('Not Done', 'In Progress', 'Done', name='statusenum', create_type=False)
    status_enum.create(op.get_bind(), checkfirst=True)

    # 1. projects
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    op.create_index(op.f('ix_projects_name'), 'projects', ['name'], unique=True)

    # 2. teams
    op.create_table(
        'teams',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_teams_id'), 'teams', ['id'], unique=False)
    op.create_index(op.f('ix_teams_name'), 'teams', ['name'], unique=True)

    # 3. users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=True),
        sa.Column('role', sa.Enum('employee', 'manager', 'admin', 'super_admin', name='roleenum'), nullable=True),
        sa.Column('team_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 4. months
    op.create_table(
        'months',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_months_id'), 'months', ['id'], unique=False)

    # 5. sprints
    op.create_table(
        'sprints',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('month_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['month_id'], ['months.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sprints_id'), 'sprints', ['id'], unique=False)

    # 6. user_month_plans
    op.create_table(
        'user_month_plans',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('month_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['month_id'], ['months.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_month_plans_id'), 'user_month_plans', ['id'], unique=False)

    # 7. epics
    op.create_table(
        'epics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('user_month_plan_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_month_plan_id'], ['user_month_plans.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_epics_id'), 'epics', ['id'], unique=False)

    # 8. plan_items
    op.create_table(
        'plan_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('month_plan', sa.Float(), nullable=True),
        sa.Column('epic_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['epic_id'], ['epics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_plan_items_id'), 'plan_items', ['id'], unique=False)

    # 9. sprint_plan_items
    op.create_table(
        'sprint_plan_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plan_item_id', sa.Integer(), nullable=True),
        sa.Column('sprint_id', sa.Integer(), nullable=True),
        sa.Column('sprint_plan', sa.Float(), nullable=True),
        sa.Column('sprint_fact', sa.Float(), nullable=True),
        sa.Column('status', sa.Enum('Not Done', 'In Progress', 'Done', name='statusenum'), nullable=True),
        sa.ForeignKeyConstraint(['plan_item_id'], ['plan_items.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sprint_id'], ['sprints.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sprint_plan_items_id'), 'sprint_plan_items', ['id'], unique=False)

    # 10. bloggers
    op.create_table(
        'bloggers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('handle', sa.String(), nullable=True),
        sa.Column('platform', sa.String(), nullable=True),
        sa.Column('followers', sa.String(), nullable=True),
        sa.Column('reach', sa.String(), nullable=True),
        sa.Column('views', sa.Integer(), nullable=True),
        sa.Column('format', sa.String(), nullable=True),
        sa.Column('price', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('publish_date', sa.String(), nullable=True),
        sa.Column('sprint', sa.String(), nullable=True),
        sa.Column('profile_url', sa.String(), nullable=True),
        sa.Column('post_url', sa.String(), nullable=True),
        sa.Column('manager_contact', sa.String(), nullable=True),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('likes', sa.Integer(), nullable=True),
        sa.Column('comments', sa.Integer(), nullable=True),
        sa.Column('shares', sa.Integer(), nullable=True),
        sa.Column('saves', sa.Integer(), nullable=True),
        sa.Column('profile_visits', sa.Integer(), nullable=True),
        sa.Column('link_clicks', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_bloggers_handle'), 'bloggers', ['handle'], unique=False)
    op.create_index(op.f('ix_bloggers_id'), 'bloggers', ['id'], unique=False)
    op.create_index(op.f('ix_bloggers_name'), 'bloggers', ['name'], unique=False)

    # 11. companies
    op.create_table(
        'companies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('spent', sa.String(), nullable=True),
        sa.Column('items_provided', sa.String(), nullable=True),
        sa.Column('sprint', sa.String(), nullable=True),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('contact_person', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('notes', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_companies_id'), 'companies', ['id'], unique=False)
    op.create_index(op.f('ix_companies_name'), 'companies', ['name'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_companies_name'), table_name='companies')
    op.drop_index(op.f('ix_companies_id'), table_name='companies')
    op.drop_table('companies')

    op.drop_index(op.f('ix_bloggers_name'), table_name='bloggers')
    op.drop_index(op.f('ix_bloggers_id'), table_name='bloggers')
    op.drop_index(op.f('ix_bloggers_handle'), table_name='bloggers')
    op.drop_table('bloggers')

    op.drop_index(op.f('ix_sprint_plan_items_id'), table_name='sprint_plan_items')
    op.drop_table('sprint_plan_items')

    op.drop_index(op.f('ix_plan_items_id'), table_name='plan_items')
    op.drop_table('plan_items')

    op.drop_index(op.f('ix_epics_id'), table_name='epics')
    op.drop_table('epics')

    op.drop_index(op.f('ix_user_month_plans_id'), table_name='user_month_plans')
    op.drop_table('user_month_plans')

    op.drop_index(op.f('ix_sprints_id'), table_name='sprints')
    op.drop_table('sprints')

    op.drop_index(op.f('ix_months_id'), table_name='months')
    op.drop_table('months')

    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')

    op.drop_index(op.f('ix_teams_name'), table_name='teams')
    op.drop_index(op.f('ix_teams_id'), table_name='teams')
    op.drop_table('teams')

    op.drop_index(op.f('ix_projects_name'), table_name='projects')
    op.drop_index(op.f('ix_projects_id'), table_name='projects')
    op.drop_table('projects')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS statusenum')
    op.execute('DROP TYPE IF EXISTS roleenum')

