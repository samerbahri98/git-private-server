CREATE DATABASE gitdb;

CREATE GROUP git;

CREATE USER nodeapi IN GROUP git;

ALTER USER nodeapi WITH PASSWORD 'node1234'

CREATE EXTENSION pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    pw VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE repos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_name VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_created_by FOREIGN KEY(created_by) REFERENCES users(id)
);

INSERT INTO users (username,email,pw) VALUES ('samerbahri98','samer.bahri@ieee.org','1234');

INSERT INTO repos (repo_name, created_by) (SELECT 'dodecahedron',id FROM users WHERE username='samerbahri98')

SELECT  FROM repos JOIN users ON (repos.created_by = users.id);